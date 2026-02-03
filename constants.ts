import { BrandColors, CategoryColor, CategoryKey, Question, RatingColor, TranslationData } from './types';

export const APP_ID = 'motivation-catalyst-v1';
export const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbz_7fB9S7C_Xm7Kq1yX_REPLACE_ME/exec';

export const QUESTIONS: Question[] = [
  { id: 1, category: 'autonomy', text: { he: "אני מרגיש שיש לי אפשרות לבחור כיצד לבצע את עבודתי.", en: "I can choose how to perform my work." }, weight: 1 },
  { id: 2, category: 'autonomy', text: { he: "אני מרגיש לחוץ לעבוד בדרכים שלא נראות לי טבעיות.", en: "I feel pressured to work in unnatural ways." }, weight: -1 },
  { id: 3, category: 'autonomy', text: { he: "יש לי תחושת חופש ובחירה בתפקיד שלי.", en: "I feel freedom and choice in my role." }, weight: 1 },
  { id: 10, category: 'autonomy', text: { he: "אני מרגיש שיש לי השפעה על החלטות הנוגעות לעבודתי.", en: "I have influence over work decisions." }, weight: 1 },
  { id: 11, category: 'autonomy', text: { he: "דעתי נשמעת ונלקחת בחשבון על ידי הממונים עלי.", en: "My opinion is heard by superiors." }, weight: 1 },
  { id: 12, category: 'autonomy', text: { he: "אני מרגיש כבול על ידי נהלים נוקשים.", en: "I feel bound by rigid procedures." }, weight: -1 },
  { id: 4, category: 'competence', text: { he: "אני מרגיש בטוח ביכולת שלי לבצע את המשימות היטב.", en: "I am confident in my ability to perform well." }, weight: 1 },
  { id: 5, category: 'competence', text: { he: "לעיתים קרובות אני מרגיש לא כשיר לעמוד בדרישות.", en: "I often feel inadequate to meet demands." }, weight: -1 },
  { id: 6, category: 'competence', text: { he: "יש לי הזדמנות להשתמש בכישורים הטובים ביותר שלי.", en: "I use my best skills every day." }, weight: 1 },
  { id: 13, category: 'competence', text: { he: "אני מרגיש שאני לומד ומתפתח מקצועית.", en: "I am learning and developing professionally." }, weight: 1 },
  { id: 14, category: 'competence', text: { he: "אני בטוח ביכולתי למצוא פתרון לאתגרים.", en: "I am confident finding solutions to challenges." }, weight: 1 },
  { id: 15, category: 'competence', text: { he: "לפעמים אני חושש שאין לי את הכישורים הנדרשים.", en: "Sometimes I worry I lack necessary skills." }, weight: -1 },
  { id: 7, category: 'relatedness', text: { he: "אני מרגיש תחושת שייכות עם האנשים בעבודה.", en: "I feel a sense of belonging with colleagues." }, weight: 1 },
  { id: 8, category: 'relatedness', text: { he: "אני מרגיש בודד או מבודד כשאני בעבודה.", en: "I feel lonely or isolated at work." }, weight: -1 },
  { id: 9, category: 'relatedness', text: { he: "אני מרגיש שלאנשים שאני עובד איתם אכפת ממני.", en: "People I work with care about me." }, weight: 1 },
  { id: 16, category: 'relatedness', text: { he: "אני מרגיש בנוח לשתף את חבריי לצוות בקשיים.", en: "I feel comfortable sharing difficulties." }, weight: 1 },
  { id: 17, category: 'relatedness', text: { he: "האווירה בצוות שלי היא תומכת וחברית.", en: "The team atmosphere is supportive." }, weight: 1 },
  { id: 18, category: 'relatedness', text: { he: "אני מרגיש לעיתים שאני 'מחוץ לעניינים' חברתית.", en: "I sometimes feel socially 'out of the loop'." }, weight: -1 },
];

export const BRAND_HEX: BrandColors = {
  orange: '#E46B3F',
  green: '#90BC6E',
  pink: '#D9618E',
  lightBlue: '#78A9D6',
  darkBlue: '#324FA2',
  offWhite: '#F8FAFC'
};

export const COLORS: Record<CategoryKey, CategoryColor> = {
  autonomy: { hex: BRAND_HEX.orange, bg: 'bg-[#E46B3F]/5', text: 'text-[#E46B3F]', border: 'border-[#E46B3F]/20' },
  competence: { hex: BRAND_HEX.lightBlue, bg: 'bg-[#78A9D6]/5', text: 'text-[#78A9D6]', border: 'border-[#78A9D6]/20' }, 
  relatedness: { hex: BRAND_HEX.pink, bg: 'bg-[#D9618E]/5', text: 'text-[#D9618E]', border: 'border-[#D9618E]/20' } 
};

export const RATING_COLORS: Record<number, RatingColor> = {
  1: { selected: 'bg-[#E46B3F] text-white border-[#E46B3F] shadow-lg shadow-[#E46B3F]/30', unselected: 'bg-white text-[#E46B3F] border-[#E46B3F]/20 hover:border-[#E46B3F] hover:bg-[#E46B3F]/5' },
  2: { selected: 'bg-[#D9618E] text-white border-[#D9618E] shadow-lg shadow-[#D9618E]/30', unselected: 'bg-white text-[#D9618E] border-[#D9618E]/20 hover:border-[#D9618E] hover:bg-[#D9618E]/5' },
  3: { selected: 'bg-slate-400 text-white border-slate-400 shadow-lg shadow-slate-400/30', unselected: 'bg-white text-slate-400 border-slate-200 hover:border-slate-400 hover:bg-slate-50' },
  4: { selected: 'bg-[#78A9D6] text-white border-[#78A9D6] shadow-lg shadow-[#78A9D6]/30', unselected: 'bg-white text-[#78A9D6] border-[#78A9D6]/20 hover:border-[#78A9D6] hover:bg-[#78A9D6]/5' },
  5: { selected: 'bg-[#324FA2] text-white border-[#324FA2] shadow-lg shadow-[#324FA2]/30', unselected: 'bg-white text-[#324FA2] border-[#324FA2]/20 hover:border-[#324FA2] hover:bg-[#324FA2]/5' },
};

export const TRANSLATIONS: Record<'he' | 'en', TranslationData> = {
  he: {
    dir: 'rtl',
    title: 'קתליזטור למוטיבציה', 
    subtitle: 'הנוסחה המדעית לצמיחה ומימוש',
    sdtIntro: 'גלו את המרכיבים המדויקים שיוצרים אצלכם מוטיבציה פנימית: אוטונומיה, מסוגלות ושייכות.',
    painTitle: 'מרגישים תקועים?',
    painText: 'חוסר מוטיבציה, תחושה של דריכה במקום ושחיקה בעבודה הן לא גזירת גורל. לפעמים פשוט חסר לנו המרכיב הנכון ב"כימיה" המקצועית שלנו.',
    solutionTitle: 'הפתרון: מדע המוטיבציה',
    solutionText: 'מודל ה-SDT הוא שיטה מוכחת מחקרית המבוססת על עשורים של מחקר פסיכולוגי. המודל נחשב ל"תקן הזהב" במדעי ההתנהגות ומזהה את הצרכים הבסיסיים שחייבים להתקיים כדי שתרגישו חיוניות ומשמעות בעבודה.',
    valueTitle: 'למה כדאי לכם לבצע את האבחון?',
    valueList: [
      'מבוסס על מעל 40 שנות מחקר אמפירי הנתמך במאות מחקרים אקדמיים.',
      'בשימוש על ידי חברות Fortune 500 וארגונים גלובליים למיטוב מחוברות.',
      'בהירות לגבי המרכיבים המדויקים שחסרים לכם למוטיבציה שיא.',
      'טיפים פרקטיים המתרגמים תיאוריה פסיכולוגית לצעדים בני-יישום.',
      'כלי מדויק ומקצועי לשיתוף הצרכים שלכם עם המנהל/ת.'
    ],
    learnMore: 'מה זה SDT?',
    learnMoreUrl: 'https://www.emerald.com/omj/article/18/2/76/314438/Motivating-workers-how-leaders-apply-self',
    employeeName: 'שם מלא',
    employeeEmail: 'כתובת אימייל',
    managerName: 'שם המנהל/ת',
    managerEmail: 'אימייל המנהל/ת',
    beginBtn: 'בואו נתחיל',
    next: 'הבא',
    viewResults: 'חשב תוצאות',
    profileTitle: 'פרופיל מוטיבציה אישי',
    userInsights: 'תובנות לצמיחה אישית',
    managerRecs: 'המלצות לניהול מעצים',
    copyReport: 'העתק דוח מלא',
    copyEmployee: 'העתק תובנות',
    copyManager: 'העתק המלצות',
    saveForMe: 'שמור לעצמי',
    sendToManager: 'שתף עם מנהל',
    managerDetailsTitle: 'פרטי המנהל',
    managerDetailsDesc: 'הכנס את פרטי המנהל כדי להכין את המייל לשליחה.',
    prepareEmail: 'הכן מייל',
    newAssessment: 'התחל מחדש',
    copied: 'הועתק ללוח!',
    copiedSection: 'התוכן הועתק!',
    agree: 'מסכים',
    disagree: 'לא מסכים',
    testMode: 'בדיקת מערכת',
    testHigh: 'חיובי',
    testMid: 'סטנדרט',
    testAtRisk: 'בסיכון',
    questionProgress: 'שאלה',
    followMe: 'עקבו אחריי לעוד',
    startOver: 'התחל שאלון מחדש',
    categories: { autonomy: 'אוטונומיה', competence: 'מסוגלות', relatedness: 'שייכות' },
    aiInsightsTitle: 'ניתוח AI מעמיק וטיפים',
    feedbackTitle: 'האם התובנות עזרו לך?',
    feedbackComment: 'נשמח לשמוע עוד (אופציונלי):',
    sendFeedback: 'שלח משוב',
    feedbackThanks: 'תודה על המשוב!',
    genConversation: 'איך ליזום שיחה?',
    conversationTitle: 'טיפ לשיחה',
    conversationIntro: 'הצעה לפתיחת שיחה:',
    deepAnalysis: {
      autonomy: {
        title: 'אוטונומיה (בחירה ושליטה)',
        employee: {
          low: { analysis: 'נראה שאתה מרגיש "מיקרו-ניהול" או חוסר יכולת להשפיע על סדר היום שלך.', actions: ['בקש פגישת הגדרת גבולות גזרה', 'הצע שיפורים בתהליכי העבודה'], aiTips: 'נסה שיטת "ניהול יומן חוסם" (Time Blocking) כדי לייצר לעצמך מרחב עבודה עצמאי. בשיחה הבאה עם המנהל, הצע משימה אחת שאתה לוקח עליה אחריות מלאה מהתחלה ועד הסוף.' },
          high: { analysis: 'יש לך תחושת חופש ובעלות גבוהה על המשימות שלך.', actions: ['המשך ליזום פרויקטים חדשים', 'שמש דוגמה לניהול עצמי בצוות'], aiTips: 'נצל את החופש שלך כדי לחקור כלים חדשים שיכולים לשדרג את ביצועי הצוות. זה הזמן להוביל יוזמות שמעבר להגדרת התפקיד הפורמלית.' }
        },
        manager: {
          low: { analysis: 'העובד מרגיש כבול. חוסר אוטונומיה מוביל לשחיקה מהירה.', actions: ['הגדר את ה"מה" ושחרר את ה"איך"', 'שתף את העובד בקבלת החלטות'] },
          high: { analysis: 'העובד מרגיש אמון מלא. זהו מנוע צמיחה חזק.', actions: ['האצל סמכויות מורכבות יותר', 'הימנע ממעורבות יתר במשימות שגורות'] }
        }
      },
      competence: {
        title: 'מסוגלות (יכולת והישגים)',
        employee: {
          low: { analysis: 'ייתכן שאתה מרגיש שהאתגרים גדולים מהכלים שיש לך כרגע.', actions: ['זהה צורך בהכשרה ובקש אותה', 'חגוג הצלחות קטנות ביום-יום'], aiTips: 'פרק משימות גדולות למשימות קטנות של 15 דקות. כל וי (V) קטן כזה בונה את תחושת המסוגלות שלך מחדש. חפש "למידת מיקרו" (Micro-learning) של 10 דקות ביום בנושא שמעניין אותך.' },
          high: { analysis: 'אתה מרגיש מקצועי, חד ובעל יכולת לתרום לצוות.', actions: ['חפש אתגרים חדשים שמותחים אותך', 'שמש כמנטור לעובדים אחרים'], aiTips: 'זה הזמן המושלם לבקש פרויקט "מתיחה" (Stretch Assignment) שיחשוף אותך לתחומים חדשים בארגון. היכולת שלך ללמד אחרים היא הדרך הטובה ביותר לשכלל את המומחיות שלך.' }
        },
        manager: {
          low: { analysis: 'העובד חווה תסכול או חשש מחוסר הצלחה.', actions: ['פרק משימות ליעדים קטנים וברי השגה', 'ספק משוב בונה ומיידי'] },
          high: { analysis: 'העובד בטוח ביכולותיו ומספק תוצאות איכותיות.', actions: ['בדוק אפשרות לקידום או הרחבת אחריות', 'שבח את המיומנות הספציפית שלו'] }
        }
      },
      relatedness: {
        title: 'שייכות (חיבור ומשמעות)',
        employee: {
          low: { analysis: 'אתה עשוי להרגיש מנותק חברתית או שהעבודה שלך לא מקבלת הערכה.', actions: ['יזום אינטראקציות חברתיות לא פורמליות', 'מצא שותף להתייעצות קבועה'], aiTips: 'קבע "קפה וירטואלי" או פיזי של 10 דקות עם קולגה שלא דיברת איתו מזמן. השיתוף בקשיים קטנים יכול לייצר חיבור מהיר ולהפחית את תחושת הבידוד.' },
          high: { analysis: 'אתה מרגיש חלק בלתי נפרד מהצוות וזוכה לתמיכה.', actions: ['חזק את הקשרים הקיימים', 'הייה הגורם המקשר לאחרים שמרגישים מחוץ לעניינים'], aiTips: 'השתמש בחיבור החזק שלך כדי לעזור לעובדים חדשים להיקלט. תחושת המשמעות שלך תגדל ככל שתהיה "הדבק" ששומר על הצוות מאוחד.' }
        },
        manager: {
          low: { analysis: 'העובד מרגיש מבודד. חוסר שייכות פוגע במחויבות.', actions: ['קבע פגישות 1:1 אישיות (לא רק על משימות)', 'שלב אותו בצוותי חשיבה משותפים'] },
          high: { analysis: 'העובד מחובר היטב לתרבות הארגונית ולצוות.', actions: ['המשך לטפח סביבה בטוחה ותומכת', 'הבע הערכה פומבית על תרומתו לצוות'] }
        }
      }
    },
    conversationTips: {
      employee: {
        autonomy: '"היי [שם המנהל], הייתי רוצה לקבוע זמן לדבר על תהליכי העבודה שלי. אני מרגיש שאוכל לתרום יותר אם תהיה לי יותר גמישות בדרך הביצוע."',
        competence: '"היי [שם המנהל], אני נתקל באתגרים במשימות האחרונות והייתי שמח לקבל הכוונה או כלים נוספים שיעזרו לי להצליח."',
        relatedness: '"היי [שם המנהל], אני מרגיש לאחרונה קצת מנותק מהצוות. האם אפשר לחשוב יחד על דרכים לשיתוף פעולה הדוק יותר בפרויקטים הקרובים?"',
        high: '"היי [שם המנהל], אני מרגיש שאני נמצא במקום טוב מבחינה מקצועית והייתי שמח לדון באפשרויות להתפתח ולקחת על עצמי אתגרים חדשים."'
      },
      manager: {
        autonomy: '"היי [שם העובד], חשוב לי שתרגיש בעלות על המשימות שלך. בוא נשב ונדבר על איפה אני יכול לשחרר קצת ולתת לך יותר מרחב פעולה."',
        competence: '"היי [שם העובד], אני רוצה לוודא שיש לך את כל מה שצריך כדי להצליח. האם יש הכשרה או כלים שחסרים לך כרגע?"',
        relatedness: '"היי [שם העובד], שמתי לב שאנחנו פחות מתקשרים לאחרונה. בוא נצא לקפה, חשוב לי לשמוע איך אתה מרגיש בצוות ברמה האישית."',
        high: '"היי [שם העובד], אני מאוד מעריך את העבודה שלך לאחרונה. בוא נחשוב יחד איך משמרים את האנרגיה הטובה הזו ומה הצעד הבא עבורך."'
      }
    }
  },
  en: {
    dir: 'ltr',
    title: 'The Motivation Catalyst',
    subtitle: 'Science-Backed Drive & Growth',
    sdtIntro: 'Discover the precise elements creating your inner drive: Autonomy, Competence, and Relatedness.',
    painTitle: 'Feeling Stuck?',
    painText: 'Lack of motivation and growth aren\'t permanent. You\'re likely missing a core "chemistry" component.',
    solutionTitle: 'The Solution: Science of Motivation',
    solutionText: 'The SDT model is an academically validated framework identifying core needs required for vital work engagement. Based on over 40 years of research, it is considered the "gold standard" in behavioral science for human motivation.',
    valueTitle: 'Why take this assessment?',
    valueList: [
      'Empirically validated: Based on 40+ years of psychological research.',
      'Global Standard: Used by Fortune 500 companies to optimize engagement.',
      'Clarity: Understand the precise drivers behind your daily motivation.',
      'Practicality: Get actionable tips that translate theory into behavior.',
      'Communication: A professional way to share needs with your manager.'
    ],
    learnMore: 'What is SDT?',
    learnMoreUrl: 'https://www.emerald.com/omj/article/18/2/76/314438/Motivating-workers-how-leaders-apply-self',
    employeeName: 'Full Name',
    employeeEmail: 'Email Address',
    managerName: 'Manager Name',
    managerEmail: 'Manager Email',
    beginBtn: 'Start Assessment',
    next: 'Next',
    viewResults: 'View Results',
    profileTitle: 'Motivation Profile',
    outOf: 'out of 5.0',
    userInsights: 'Insights',
    aiInsightsTitle: 'AI Deep Analysis',
    feedbackTitle: 'Was this helpful?',
    feedbackThanks: 'Thanks!',
    feedbackComment: 'Tell us more (Optional):',
    sendFeedback: 'Send Feedback',
    managerRecs: 'Manager Recommendations',
    copyReport: 'Copy Report',
    copyEmployee: 'Copy Insights',
    copyManager: 'Copy Tips',
    saveForMe: 'Save',
    sendToManager: 'Share with Manager',
    managerDetailsTitle: 'Manager Details',
    managerDetailsDesc: 'Enter manager details to prepare email.',
    prepareEmail: 'Copy & Prepare Email',
    emailPrepSuccess: 'Copied! Now paste them into the email.',
    newAssessment: 'New Analysis',
    startOver: 'Start Over',
    copied: 'Copied!',
    copiedSection: 'Copied!',
    agree: 'Agree',
    disagree: 'Disagree',
    testMode: 'Demo',
    testHigh: 'High',
    testMid: 'Mixed',
    testAtRisk: 'Risk',
    questionProgress: 'Question',
    genConversation: 'Talk Strategy',
    conversationTitle: 'Conversation Tip',
    conversationIntro: 'Based on results, try opening with:',
    followMe: 'Follow me for more',
    categories: { autonomy: 'Autonomy', competence: 'Competence', relatedness: 'Relatedness' },
    deepAnalysis: {
      autonomy: {
        title: 'Autonomy',
        employee: {
          low: { analysis: 'It seems you feel micromanaged or lack the ability to influence your own schedule and workflows.', actions: ['Request a boundary-setting meeting', 'Suggest improvements to existing work processes'], aiTips: 'Try using "Time Blocking" to create independent workspace for yourself. In your next meeting with your manager, propose one task you can take full end-to-end responsibility for.' },
          high: { analysis: 'You have a strong sense of freedom and high ownership over your tasks and projects.', actions: ['Continue initiating new projects', 'Serve as a role model for self-management in the team'], aiTips: 'Leverage your freedom to research new tools that can upgrade team performance. This is the time to lead initiatives that go beyond your formal job description.' }
        },
        manager: {
          low: { analysis: 'Employee feels restricted. A lack of autonomy leads to rapid burnout.', actions: ["Define the 'what' and release the 'how'", "Involve the employee in decision-making processes"] },
          high: { analysis: 'Employee feels fully trusted. This is a powerful growth engine.', actions: ['Delegate more complex authorities', 'Avoid over-involvement in routine tasks'] }
        }
      },
      competence: {
        title: 'Competence',
        employee: {
          low: { analysis: 'You might feel that the current challenges are greater than the tools or training you have at your disposal.', actions: ['Identify specific training needs and request them', 'Celebrate small daily successes to build momentum'], aiTips: 'Break large tasks into 15-minute micro-tasks. Each small checkmark builds your sense of competence. Look for 10-minute "Micro-learning" daily on a topic that interests you.' },
          high: { analysis: 'You feel professional, sharp, and highly capable of delivering quality results for the team.', actions: ["Seek new 'stretch' challenges that push your limits", "Serve as a mentor for other team members"], aiTips: 'This is the perfect time to request a "Stretch Assignment" that exposes you to new areas of the organization. Your ability to teach others is the best way to further refine your own expertise.' }
        },
        manager: {
          low: { analysis: 'Employee is experiencing frustration or fear of failure.', actions: ['Break tasks into small, achievable goals', 'Provide constructive and immediate feedback'] },
          high: { analysis: 'Employee is confident in their abilities and delivers high-quality results.', actions: ['Explore promotion or expanded responsibility', 'Praise their specific professional skills'] }
        }
      },
      relatedness: {
        title: 'Relatedness',
        employee: {
          low: { analysis: 'You may feel socially disconnected or that your contributions are not fully recognized by your peers.', actions: ['Initiate informal social interactions', 'Find a partner for regular professional consultation'], aiTips: 'Schedule a 10-minute "virtual or physical coffee" with a colleague you haven\'t spoken to in a while. Sharing small difficulties can create quick connections and reduce isolation.' },
          high: { analysis: 'You feel like an integral part of the team and receive genuine support from your colleagues.', actions: ['Strengthen existing connections', 'Be a bridge for others who might feel excluded'], aiTips: 'Use your strong connections to help new hires integrate. Your sense of meaning will grow as you become the "glue" that keeps the team united.' }
        },
        manager: {
          low: { analysis: 'Employee feels isolated. Lack of belonging harms commitment.', actions: ['Schedule personal 1:1 meetings (not just task-focused)', 'Include them in collaborative thinking groups'] },
          high: { analysis: 'Employee is well-connected to the organizational culture and the team.', actions: ['Continue fostering a safe and supportive environment', 'Express public appreciation for their team contribution'] }
        }
      }
    },
    conversationTips: {
      employee: {
        autonomy: '"Hi [Manager], I\'d like to discuss my workflows. I feel I could contribute more with more flexibility."',
        competence: '"Hi [Manager], I\'m facing challenges with recent tasks and would appreciate guidance/tools."',
        relatedness: '"Hi [Manager], I\'ve felt disconnected lately. Can we brainstorm ways to collaborate more closely?"',
        high: '"Hi [Manager], I feel good professionally and would love to discuss new challenges."'
      },
      manager: {
        autonomy: '"Hi [Employee], I want you to feel ownership. Let\'s chat about where I can step back."',
        competence: '"Hi [Employee], do you have everything needed to succeed? Any training/tools missing?"',
        relatedness: '"Hi [Employee], we haven\'t connected lately. Let\'s grab coffee; I want to hear how you are."',
        high: '"Hi [Employee], I appreciate your work. Let\'s think about how to maintain this energy."'
      }
    }
  }
};
