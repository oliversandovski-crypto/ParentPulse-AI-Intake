import Anthropic from "@anthropic-ai/sdk";
import coaches from "@/lib/coaches.json";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MODEL = "claude-sonnet-5";

type ChatMessage = { role: "user" | "assistant"; content: string };

const CHAT_SYSTEM_PROMPT = `You are a warm, brief intake conversation for a parent coaching service. You are not a coach and you never give advice - you are gathering context so a human coach can be matched and prepared.

Ask exactly one question at a time, in plain, warm language. Adapt each question based on everything said so far - do not follow a fixed script. Cover, over the course of the conversation:
- roughly how old the child is
- what's actually going on (the presenting concern, in their words)
- what they've already tried, if anything
- how urgent or distressing this feels to them right now
- what a good outcome would look like to them

Once you have enough to make a real match (usually 4-7 exchanges), call complete_intake instead of asking another question. Do not drag the conversation out once you have enough - respect their time.

Never diagnose, never give parenting advice, never suggest a specific technique. You are only listening and organizing.`;

const CHAT_TOOLS: Anthropic.Tool[] = [
  {
    name: "ask_next_question",
    description: "Ask the parent the single next question in the conversation.",
    input_schema: {
      type: "object",
      properties: {
        question: { type: "string", description: "The next question, warm and plain-language, one question only." },
      },
      required: ["question"],
    },
  },
  {
    name: "complete_intake",
    description: "Signal that enough context has been gathered. Provide the structured summary.",
    input_schema: {
      type: "object",
      properties: {
        child_age: { type: "string" },
        presenting_concern: { type: "string" },
        tried_so_far: { type: "string" },
        urgency: { type: "string" },
        desired_outcome: { type: "string" },
        closing_message: {
          type: "string",
          description: "One warm sentence to show the parent now, before the match appears.",
        },
      },
      required: [
        "child_age",
        "presenting_concern",
        "tried_so_far",
        "urgency",
        "desired_outcome",
        "closing_message",
      ],
    },
  },
];

function matchSystemPrompt() {
  const roster = coaches
    .map(
      (c) =>
        `- id: ${c.id}\n  name: ${c.name}\n  focus: ${c.focus}\n  background: ${c.background}\n  good for: ${c.goodFor.join(", ")}`
    )
    .join("\n");

  return `You match a family to exactly one coach from this fixed roster. You may ONLY select a coach id that appears below - never invent a coach or describe someone not on this list.

ROSTER:
${roster}

Given the intake summary, call select_coach with the best-fit coach id and a short, specific reason grounded in that coach's actual focus and "good for" list above - reference the real match, not generic praise.`;
}

const MATCH_TOOLS: Anthropic.Tool[] = [
  {
    name: "select_coach",
    description: "Select the best-fit coach from the fixed roster.",
    input_schema: {
      type: "object",
      properties: {
        coach_id: {
          type: "string",
          enum: coaches.map((c) => c.id),
          description: "Must be one of the roster ids, exactly.",
        },
        reasoning: {
          type: "string",
          description: "1-3 sentences, specific to this family and this coach's real focus.",
        },
      },
      required: ["coach_id", "reasoning"],
    },
  },
];

export async function POST(req: NextRequest) {
  const body = await req.json();
  const mode: "chat" | "match" = body.mode ?? "chat";

  if (mode === "chat") {
    const messages: ChatMessage[] = body.messages ?? [];

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 500,
      system: CHAT_SYSTEM_PROMPT,
      tools: CHAT_TOOLS,
      tool_choice: { type: "any" },
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const toolUse = response.content.find((b) => b.type === "tool_use") as
      | Anthropic.ToolUseBlock
      | undefined;

    if (!toolUse) {
      return NextResponse.json({ error: "no tool call returned" }, { status: 500 });
    }

    if (toolUse.name === "ask_next_question") {
      return NextResponse.json({
        done: false,
        question: (toolUse.input as { question: string }).question,
      });
    }

    return NextResponse.json({
      done: true,
      summary: toolUse.input,
    });
  }

  if (mode === "match") {
    const summary = body.summary;

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 400,
      system: matchSystemPrompt(),
      tools: MATCH_TOOLS,
      tool_choice: { type: "tool", name: "select_coach" },
      messages: [
        {
          role: "user",
          content: `Intake summary:\n${JSON.stringify(summary, null, 2)}`,
        },
      ],
    });

    const toolUse = response.content.find((b) => b.type === "tool_use") as
      | Anthropic.ToolUseBlock
      | undefined;

    if (!toolUse) {
      return NextResponse.json({ error: "no match returned" }, { status: 500 });
    }

    const input = toolUse.input as { coach_id: string; reasoning: string };
    const coach = coaches.find((c) => c.id === input.coach_id);

    if (!coach) {
      return NextResponse.json({ error: "matched id not in roster" }, { status: 500 });
    }

    return NextResponse.json({ coach, reasoning: input.reasoning });
  }

  return NextResponse.json({ error: "unknown mode" }, { status: 400 });
}
