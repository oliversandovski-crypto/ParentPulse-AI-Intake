// Faithful recreation of Julie's existing WordPress plugin question tree.
// Source: https://github.com/Nirva258/ParentPulse_Plugin_Questionnarie
// Every question, option, branch target, and final Jane App destination matches
// plugin.php exactly. See knowledge/parent-pulse/existing-questionnaire-plugin.md
// for the full written analysis this was extracted from.

export const JANE_BASE = "https://parentpulsecoaching.janeapp.com/#/";

export const legacyTree = {
  question1: {
    question: "What is your biggest worry at the present moment?",
    options: [
      { label: "My Children", next: "show_childquestions" },
      { label: "Work", next: "show_workquestions" },
      { label: "My Relationship", next: "show_relationshipquestions" },
    ],
  },
  show_childquestions: {
    question: "Are you researching ways to help your children thrive?",
    options: [
      { label: "Yes", next: "Yes" },
      { label: "No", final: "staff_member/1" },
    ],
  },
  Yes: {
    question: "What are your biggest concerns with your child/children?",
    options: [
      { label: "Learning & Development", next: "show_learningdevelopment" },
      { label: "Friend & Social Skills", next: "show_friendandsocialskills" },
      { label: "Behavioral Concerns", next: "show_behavioralconcerns" },
      { label: "Balancing Extracurricular & Academics", next: "show_balancingextraandacademics" },
      { label: "Emotional Well-Being", next: "show_emotionalwellbeing" },
      { label: "Health Concerns", next: "show_healthconcerns" },
    ],
  },
  show_learningdevelopment: {
    question: "What are your biggest concerns with your child's learning?",
    options: [
      { label: "Learning Difficulties", next: "show_learningdifficulties" },
      { label: "Motivation", next: "show_motivation" },
      { label: "Understanding the Curriculum", next: "show_curriculum" },
      { label: "Overall Academic Achievement", next: "show_academic" },
      { label: "Reading", next: "show_reading" },
      { label: "Giftedness", next: "show_giftedness" },
    ],
  },
  show_learningdifficulties: {
    question: "Does your child have one of the following?",
    options: [
      { label: "ADHD", final: "staff_member/1" },
      { label: "Learning Disability", final: "staff_member/21" },
      { label: "Language Impairment", final: "staff_member/6" },
      { label: "Autism", final: "staff_member/26" },
      { label: "Hearing Impairment", final: "staff_member/10" },
      { label: "Vision Impairment", final: "staff_member/44" },
    ],
  },
  show_motivation: {
    question: "What issues are affecting your child's motivation",
    options: [
      { label: "Academic Pressure", next: "show_age" },
      { label: "Extracurriculars (Sports, Arts, Music)", next: "show_extracurriculars" },
      { label: "Social Interactions", final: "staff_member/3" },
    ],
  },
  show_age: {
    question: "How old is your child?",
    options: [
      { label: "5 and under", final: "staff_member/29" },
      { label: "6-9 Years", final: "staff_member/44" },
      { label: "10-18 Years", final: "staff_member/37" },
    ],
  },
  show_extracurriculars: {
    question: "In which activities?",
    options: [
      { label: "Sports", final: "staff_member/37" },
      { label: "Arts And Music", final: "staff_member/47" },
    ],
  },
  show_curriculum: {
    question: "How old is your child?",
    options: [
      { label: "5 and under", final: "staff_member/29" },
      { label: "6 to 9 years", final: "staff_member/40" },
      { label: "10 to 13 years", final: "staff_member/13" },
      { label: "14 to 18 years", final: "staff_member/8" },
    ],
  },
  show_academic: {
    question: "How old is your child?",
    options: [
      { label: "5 and under", final: "kindergarten-parent-coach" },
      { label: "6 to 9 years", final: "academic-support-for-the-primary-child-grade-1-4" },
      { label: "10 to 18 years", final: "parenting-teens-through-their-academic-journey" },
    ],
  },
  show_reading: {
    question: "How old is your child?",
    options: [
      { label: "5 and under", final: "reading-intervention-support" },
      { label: "6 to 9 years", final: "reading-intervention-support" },
      { label: "10 to 13 years", final: "reading-intervention-support" },
      { label: "14 to 18 years", final: "reading-intervention-support" },
    ],
  },
  show_giftedness: {
    question: "What is your primary concern related to your gifted child?",
    options: [
      { label: "Asynchronous Development", final: "gifted-child" },
      { label: "Emotional Well-Being", final: "gifted-child" },
      { label: "Academic Guidance", final: "gifted-child" },
    ],
  },
  show_friendandsocialskills: {
    question: "What social concerns do you have about your child?",
    options: [
      { label: "Difficulties Making Friends", next: "show_socialage" },
      { label: "Lack Of Friendships", next: "show_socialage" },
      { label: "Social Media Exposure", next: "show_socialage" },
      { label: "School Discipline Issues", next: "show_socialage" },
    ],
  },
  show_socialage: {
    question: "How old is your child?",
    options: [
      { label: "4 to 9 years", final: "social-emotional-learning-behaviour-support-for-parents-with-children-4-9-years-of-age" },
      { label: "10-13 years", final: "supporting-parents-with-social-emotional-struggles-for-pre-teen-and-teens" },
      { label: "14 to 18 years", final: "supporting-parents-with-social-emotional-struggles-for-pre-teen-and-teens" },
    ],
  },
  show_behavioralconcerns: {
    question: "What behavior is most concerning for you about your child?",
    options: [
      { label: "School Discipline Issues", next: "show_behavioralage" },
      { label: "Self-Regulation (Home/School)", next: "show_behavioralage" },
      { label: "Defiance", final: "supporting-parents-with-social-emotional-struggles-for-pre-teen-and-teens" },
      { label: "Physical / Verbal Aggression", final: "supporting-parents-with-social-emotional-struggles-for-pre-teen-and-teens" },
    ],
  },
  show_behavioralage: {
    question: "How old is your child?",
    options: [
      { label: "4 to 9 years", final: "social-emotional-learning-behaviour-support-for-parents-with-children-4-9-years-of-age" },
      { label: "10 to 16 years", final: "supporting-parents-with-social-emotional-struggles-for-pre-teen-and-teens" },
      { label: "16 to 18 years", final: "staff_member/1" },
    ],
  },
  show_balancingextraandacademics: {
    question: "What type of extracurricular activity is your child involved in?",
    options: [
      { label: "Sports", final: "high-performance-athletes" },
      { label: "Dance", final: "supporting-your-child-through-the-arts-dance-music-drama-coaching" },
      { label: "Drama", final: "supporting-your-child-through-the-arts-dance-music-drama-coaching" },
      { label: "Music", final: "supporting-your-child-through-the-arts-dance-music-drama-coaching" },
    ],
  },
  show_emotionalwellbeing: {
    question: "What emotional challenges are you concerned about?",
    options: [
      { label: "Anxiety", next: "show_ageforemotional" },
      { label: "Grief", final: "parent-pulse-coach" },
      { label: "Mindfulness Strategies", final: "mindfulness-coaching-for-parents" },
      { label: "Self-Regulation", final: "social-emotional-learning-behaviour-support-for-parents-with-children-4-9-years-of-age" },
    ],
  },
  show_ageforemotional: {
    question: "How old is your child?",
    options: [
      { label: "4 to 9 Years", final: "social-emotional-learning-behaviour-support-for-parents-with-children-4-9-years-of-age" },
      { label: "10 to 18 Years", final: "supporting-parents-with-social-emotional-struggles-for-pre-teen-and-teens" },
    ],
  },
  show_healthconcerns: {
    question: "What area of your child's health are you most concerned about?",
    options: [
      { label: "Health Concerns", next: "show_healthoptions" },
      { label: "Nutrition Concerns", final: "dietetics" },
    ],
  },
  show_healthoptions: {
    question: "Please specify the health condition you are concerned about?",
    options: [
      { label: "Epilepsy", final: "epilepsy-parent-coaching" },
      { label: "Diabetes", final: "dietetics" },
      { label: "Vision", final: "low-vision-and-blind-parent-coaching" },
      { label: "Hearing", final: "deaf-and-hard-of-hearing-support" },
    ],
  },
  show_workquestions: {
    question: "Do you often feel overwhelmed trying to balance parenting with your other responsibilities?",
    options: [
      { label: "Yes", next: "show_yeswork" },
      { label: "No", final: "help-me-find-a-coach" },
    ],
  },
  show_yeswork: {
    question: "Do you struggle with balancing your work and home responsibilities?",
    options: [
      { label: "Yes", next: "show_sourceofstress" },
      { label: "No", final: "help-me-find-a-coach" },
    ],
  },
  show_sourceofstress: {
    question: "What is the biggest source of stress in your work-life balance?",
    options: [
      { label: "Maintaining personal well-being while balancing work & family life", next: "show_wellbeing" },
      { label: "Advancing my career while staying present for my child", final: "help-me-find-a-coach" },
      { label: "Providing nutritious meals for my family despite a busy schedule", final: "dietetics" },
      { label: "Coping with stress and parenting demands through mindfulness", next: "show_copingstress" },
    ],
  },
  show_wellbeing: {
    question: "What you think is more difficult to manage?",
    options: [
      { label: "Personal well-being", next: "show_personalwellbeing" },
      { label: "Work and family responsibilities", next: "show_workresponsibilities" },
    ],
  },
  show_personalwellbeing: {
    question: "What aspect of personal well-being do you struggle with the most?",
    options: [
      { label: "Physical health", final: "dietetics" },
      { label: "Emotional well-being", final: "mindfulness-coaching-for-parents" },
      { label: "Time for self-care", final: "parent-pulse-coach" },
      { label: "Mental overload", final: "help-me-find-a-coach" },
    ],
  },
  show_workresponsibilities: {
    question: "What aspect of work and family balance is most challenging for you?",
    options: [
      { label: "Keeping up with household and parenting duties while managing work", final: "parent-pulse-coach" },
      { label: "Feeling guilty about not spending enough quality time with my children", final: "parent-pulse-coach" },
      { label: "Struggling with work-related stress that impacts my home life", final: "mindfulness-coaching-for-parents" },
      { label: "Managing time effectively between work, family, and personal needs", final: "help-me-find-a-coach" },
    ],
  },
  show_copingstress: {
    question: "How does stress impact your daily parenting experience?",
    options: [
      { label: "I often feel overwhelmed and emotionally drained", next: "show_option1" },
      { label: "I struggle with staying patient and calm with my child", next: "show_option2" },
      { label: "I find it hard to be present and enjoy time with my family", next: "show_option3" },
      { label: "I have trouble sleeping or relaxing due to constant stress", next: "show_option4" },
    ],
  },
  show_option1: {
    question: "Do you feel like you have time for self-care?",
    options: [
      { label: "Yes, but I don't know where to start", final: "mindfulness-coaching-for-parents" },
      { label: "No, I can't find time for myself", final: "mindfulness-coaching-for-parents" },
    ],
  },
  show_option2: {
    question: "What triggers your stress the most?",
    options: [
      { label: "My child's behavior and emotional reactions", final: "mindfulness-coaching-for-parents" },
      { label: "The demands of work and home responsibilities", final: "mindfulness-coaching-for-parents" },
    ],
  },
  show_option3: {
    question: "What do you think prevents you from being fully engaged?",
    options: [
      { label: "Constant worries and distractions", final: "mindfulness-coaching-for-parents" },
      { label: "Feeling exhausted and burned out", final: "mindfulness-coaching-for-parents" },
    ],
  },
  show_option4: {
    question: "Have you tried any relaxation techniques?",
    options: [
      { label: "Yes, but they don't seem to work", final: "mindfulness-coaching-for-parents" },
      { label: "No, I don't know what to try", final: "mindfulness-coaching-for-parents" },
    ],
  },
  show_relationshipquestions: {
    question: "What aspect of your relationship with your child do you want support with?",
    options: [
      { label: "Communication", next: "show_communication" },
      { label: "Discipline", next: "show_discipline" },
      { label: "Co-Parenting", next: "show_coparenting" },
      { label: "Single Parenting", next: "show_singleparent" },
      { label: "Grandparent/Guardian Support", next: "show_grandparentsupport" },
      { label: "Connecting with Your Child", next: "show_connectingwithchild" },
      { label: "Newcomer Parenting Support", next: "show_newcomerparents" },
    ],
  },
  show_communication: {
    question: "Do you feel your child listens to you and expresses their thoughts openly?",
    options: [
      { label: "Yes", next: "show_yescommunication" },
      { label: "No", final: "help-me-find-a-coach" },
    ],
  },
  show_yescommunication: {
    question: "What specific communication challenges are you facing?",
    options: [
      { label: "My child does not talk to me about their feelings.", final: "help-me-find-a-coach" },
      { label: "We argue frequently.", final: "help-me-find-a-coach" },
      { label: "They don't follow my instructions.", final: "help-me-find-a-coach" },
    ],
  },
  show_discipline: {
    question: "Are you struggling with setting rules and boundaries that your child follows?",
    options: [
      { label: "Yes", next: "show_yesdiscipline" },
      { label: "No", final: "parent-pulse-coach" },
    ],
  },
  show_yesdiscipline: {
    question: "What behaviors are you most concerned about?",
    options: [
      { label: "Defiance", final: "parent-pulse-coach" },
      { label: "Aggression (Verbal/Physical)", final: "parent-pulse-coach" },
      { label: "School Discipline Issues", final: "parent-pulse-coach" },
      { label: "Self-Regulation at Home", final: "parent-pulse-coach" },
    ],
  },
  show_coparenting: {
    question: "What aspect of co-parenting do you need help with?",
    options: [
      { label: "Conflict over parenting styles", final: "co-parenting-single-parenting" },
      { label: "Improving your relationship with the other parent", final: "co-parenting-single-parenting" },
      { label: "Emotional well-being of my child", final: "co-parenting-single-parenting" },
    ],
  },
  show_singleparent: {
    question: "What type of support do you need as a single parent?",
    options: [
      { label: "Navigating parenting challenges alone", final: "co-parenting-single-parenting" },
      { label: "Building confidence in my parenting journey", final: "co-parenting-single-parenting" },
    ],
  },
  show_grandparentsupport: {
    question: "Are you the primary caregiver for your grandchild?",
    options: [
      { label: "Yes", next: "show_yessupport" },
      { label: "No", final: "a-guiding-light-for-modern-grandparenting" },
    ],
  },
  show_yessupport: {
    question: "What challenges do you face in this role?",
    options: [
      { label: "Managing parenting responsibilities at this stage of life", final: "a-guiding-light-for-modern-grandparenting" },
      { label: "Navigating generational differences in parenting styles", final: "a-guiding-light-for-modern-grandparenting" },
      { label: "Supporting my grandchild's emotional well-being", final: "a-guiding-light-for-modern-grandparenting" },
    ],
  },
  show_connectingwithchild: {
    question: "Do you feel emotionally connected with your child?",
    options: [
      { label: "Yes", next: "show_yesconnecting" },
      { label: "No", final: "parent-pulse-coach" },
    ],
  },
  show_yesconnecting: {
    question: "What are the main challenges in your relationship?",
    options: [
      { label: "Lack of quality time together", final: "parent-pulse-coach" },
      { label: "Struggles in understanding their emotions", final: "parent-pulse-coach" },
      { label: "Difficulty in engaging in meaningful conversations", final: "parent-pulse-coach" },
    ],
  },
  show_newcomerparents: {
    question: "Have you faced challenges adjusting to parenting in a new country?",
    options: [
      { label: "Yes", next: "show_yesnewparenting" },
      { label: "No", final: "newcomer-coaching" },
    ],
  },
  show_yesnewparenting: {
    question: "What challenges are you facing as a newcomer parent?",
    options: [
      { label: "My child's adaptation to school", final: "newcomer-coaching" },
      { label: "Language or cultural barriers", final: "newcomer-coaching" },
      { label: "Building a support network", final: "newcomer-coaching" },
    ],
  },
};
