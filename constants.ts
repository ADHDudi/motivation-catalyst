import { BrandColors, CategoryColor, CategoryKey, Question, RatingColor, TranslationData } from './types';

export const APP_ID = 'motivation-catalyst-v1';
export const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbz_7fB9S7C_Xm7Kq1yX_REPLACE_ME/exec';

export const QUESTIONS: Question[] = [
  // ── AUTONOMY ──────────────────────────────────────────────────────────────
  {
    id: 1, category: 'autonomy', weight: 1,
    text: { he: "אני מרגיש שיש לי אפשרות לבחור כיצד לבצע את עבודתי.", en: "I can choose how to perform my work." },
    managerText: { he: "אני נותן לחברי הצוות שלי את החופש לבחור כיצד הם מבצעים את עבודתם.", en: "I give my team members the freedom to choose how they perform their work." },
  },
  {
    id: 2, category: 'autonomy', weight: -1,
    text: { he: "אני מרגיש לחוץ לעבוד בדרכים שלא נראות לי טבעיות.", en: "I feel pressured to work in unnatural ways." },
    managerText: { he: "אני מרגיש לחוץ לדחוף את הצוות שלי לעבוד בדרכים שלא מתאימות להם.", en: "I feel pressured to push my team to work in ways that don't suit them." },
  },
  {
    id: 3, category: 'autonomy', weight: 1,
    text: { he: "יש לי תחושת חופש ובחירה בתפקיד שלי.", en: "I feel freedom and choice in my role." },
    managerText: { he: "חברי הצוות שלי חופשיים לקחת אחריות ולקבל החלטות בתפקידם.", en: "My team members feel free to take ownership and make decisions in their roles." },
  },
  {
    id: 10, category: 'autonomy', weight: 1,
    text: { he: "אני מרגיש שיש לי השפעה על החלטות הנוגעות לעבודתי.", en: "I have influence over work decisions." },
    managerText: { he: "אני מערב באופן פעיל את הצוות שלי בהחלטות הנוגעות לעבודתם.", en: "I actively involve my team in decisions that affect their work." },
  },
  {
    id: 11, category: 'autonomy', weight: 1,
    text: { he: "דעתי נשמעת ונלקחת בחשבון על ידי הממונים עלי.", en: "My opinion is heard by superiors." },
    managerText: { he: "אני דואג שקולו של כל חבר צוות נשמע ונלקח ברצינות.", en: "I make sure every team member's voice is heard and genuinely considered." },
  },
  {
    id: 12, category: 'autonomy', weight: -1,
    text: { he: "אני מרגיש כבול על ידי נהלים נוקשים.", en: "I feel bound by rigid procedures." },
    managerText: { he: "הצוות שלי מרגיש כבול בנהלים ותהליכים שאני מאכף.", en: "My team feels constrained by the processes and procedures I enforce." },
  },
  // ── COMPETENCE ────────────────────────────────────────────────────────────
  {
    id: 4, category: 'competence', weight: 1,
    text: { he: "אני מרגיש בטוח ביכולת שלי לבצע את המשימות היטב.", en: "I am confident in my ability to perform well." },
    managerText: { he: "אני בטוח ביכולתי לאמן ולפתח את כישורי הצוות שלי.", en: "I am confident in my ability to coach and develop my team's skills." },
  },
  {
    id: 5, category: 'competence', weight: -1,
    text: { he: "לעיתים קרובות אני מרגיש לא כשיר לעמוד בדרישות.", en: "I often feel inadequate to meet demands." },
    managerText: { he: "לעיתים קרובות אני חושש שהצוות שלי חסר את הכישורים או התמיכה הנדרשים.", en: "I often worry my team lacks the skills or support needed to meet expectations." },
  },
  {
    id: 6, category: 'competence', weight: 1,
    text: { he: "יש לי הזדמנות להשתמש בכישורים הטובים ביותר שלי.", en: "I use my best skills every day." },
    managerText: { he: "אני יוצר הזדמנויות לכל חבר צוות להשתמש ביכולות החזקות שלו.", en: "I create opportunities for each team member to use their strongest abilities." },
  },
  {
    id: 13, category: 'competence', weight: 1,
    text: { he: "אני מרגיש שאני לומד ומתפתח מקצועית.", en: "I am learning and developing professionally." },
    managerText: { he: "אני משקיע באופן פעיל בלמידה ובצמיחה המקצועית של חברי הצוות שלי.", en: "I actively invest in my team members' professional learning and growth." },
  },
  {
    id: 14, category: 'competence', weight: 1,
    text: { he: "אני בטוח ביכולתי למצוא פתרון לאתגרים.", en: "I am confident finding solutions to challenges." },
    managerText: { he: "אני מאמן את הצוות שלי להתמודד עם אתגרים ולמצוא פתרונות בעצמם.", en: "I coach my team to tackle challenges and find their own solutions." },
  },
  {
    id: 15, category: 'competence', weight: -1,
    text: { he: "לפעמים אני חושש שאין לי את הכישורים הנדרשים.", en: "Sometimes I worry I lack necessary skills." },
    managerText: { he: "לפעמים אני חושש שאיני מספק לצוות שלי את ההכוונה הנכונה לצמיחתם.", en: "I sometimes worry I'm not providing my team with the right guidance to grow." },
  },
  // ── RELATEDNESS ───────────────────────────────────────────────────────────
  {
    id: 7, category: 'relatedness', weight: 1,
    text: { he: "אני מרגיש תחושת שייכות עם האנשים בעבודה.", en: "I feel a sense of belonging with colleagues." },
    managerText: { he: "אני בונה באופן פעיל תחושת שייכות וחיבור בקרב הצוות שלי.", en: "I actively build a sense of belonging and connection among my team." },
  },
  {
    id: 8, category: 'relatedness', weight: -1,
    text: { he: "אני מרגיש בודד או מבודד כשאני בעבודה.", en: "I feel lonely or isolated at work." },
    managerText: { he: "חלק מחברי הצוות נראים מנותקים או מבודדים מהשאר.", en: "Some team members appear disconnected or isolated from the rest of the group." },
  },
  {
    id: 9, category: 'relatedness', weight: 1,
    text: { he: "אני מרגיש שלאנשים שאני עובד איתם אכפת ממני.", en: "People I work with care about me." },
    managerText: { he: "אני מבהיר לכל חבר צוות שאכפת לי באמת מהרווחה שלו.", en: "I make it clear to each team member that I genuinely care about their wellbeing." },
  },
  {
    id: 16, category: 'relatedness', weight: 1,
    text: { he: "אני מרגיש בנוח לשתף את חבריי לצוות בקשיים.", en: "I feel comfortable sharing difficulties." },
    managerText: { he: "חברי הצוות שלי מרגישים בטוחים מבחינה נפשית לשתף אותי בבעיות וקשיים.", en: "My team members feel psychologically safe to share problems or struggles with me." },
  },
  {
    id: 17, category: 'relatedness', weight: 1,
    text: { he: "האווירה בצוות שלי היא תומכת וחברית.", en: "The team atmosphere is supportive." },
    managerText: { he: "אני מטפח אווירת צוות תומכת ושיתופית באמת.", en: "I nurture a team atmosphere that is genuinely supportive and collaborative." },
  },
  {
    id: 18, category: 'relatedness', weight: -1,
    text: { he: "אני מרגיש לעיתים שאני 'מחוץ לעניינים' חברתית.", en: "I sometimes feel socially 'out of the loop'." },
    managerText: { he: "אני שם לב כשחברי צוות נראים מחוץ לשיחות או החלטות חשובות.", en: "I notice when team members seem left out of important conversations or decisions." },
  },
];

export const BRAND_HEX: BrandColors = {
  orange: '#1F7AFF',
  green: '#90BC6E',
  pink: '#3CDCF0',
  lightBlue: '#38BDF8',
  darkBlue: '#324FA2',
  offWhite: '#F8FAFC'
};

export const COLORS: Record<CategoryKey, CategoryColor> = {
  autonomy: { hex: BRAND_HEX.orange, bg: 'bg-[#1F7AFF]/5', text: 'text-[#1F7AFF]', border: 'border-[#1F7AFF]/20' },
  competence: { hex: BRAND_HEX.lightBlue, bg: 'bg-[#38BDF8]/5', text: 'text-[#38BDF8]', border: 'border-[#38BDF8]/20' },
  relatedness: { hex: BRAND_HEX.pink, bg: 'bg-[#3CDCF0]/5', text: 'text-[#3CDCF0]', border: 'border-[#3CDCF0]/20' }
};

export const RATING_COLORS: Record<number, RatingColor> = {
  1: { selected: 'bg-[#1F7AFF] text-white border-[#1F7AFF] shadow-lg shadow-[#1F7AFF]/30', unselected: 'bg-white text-[#1F7AFF] border-[#1F7AFF]/20 hover:border-[#1F7AFF] hover:bg-[#1F7AFF]/5' },
  2: { selected: 'bg-[#3CDCF0] text-white border-[#3CDCF0] shadow-lg shadow-[#3CDCF0]/30', unselected: 'bg-white text-[#3CDCF0] border-[#3CDCF0]/20 hover:border-[#3CDCF0] hover:bg-[#3CDCF0]/5' },
  3: { selected: 'bg-slate-400 text-white border-slate-400 shadow-lg shadow-slate-400/30', unselected: 'bg-white text-slate-400 border-slate-200 hover:border-slate-400 hover:bg-slate-50' },
  4: { selected: 'bg-[#38BDF8] text-white border-[#38BDF8] shadow-lg shadow-[#38BDF8]/30', unselected: 'bg-white text-[#38BDF8] border-[#38BDF8]/20 hover:border-[#38BDF8] hover:bg-[#38BDF8]/5' },
  5: { selected: 'bg-[#324FA2] text-white border-[#324FA2] shadow-lg shadow-[#324FA2]/30', unselected: 'bg-white text-[#324FA2] border-[#324FA2]/20 hover:border-[#324FA2] hover:bg-[#324FA2]/5' },
};

export const TRANSLATIONS: Record<'he' | 'en', TranslationData> = {
  he: {
    dir: 'rtl',
    title: 'MotivationOS',
    subtitle: 'Workplace Insights',
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
    categoryIntroBtn: 'מוכן!',
    categoryIntroLabel: 'חלק הבא:',
    categoryIntroDesc: {
      autonomy: 'עד כמה אתם מרגישים חופשיים לבחור כיצד ומתי לעבוד, ולהביע את הרעיונות שלכם?',
      competence: 'עד כמה אתם מרגישים מיומנים, בטוחים ומתפתחים מקצועית בתפקידכם?',
      relatedness: 'עד כמה אתם מרגישים קשורים, נתמכים ושייכים לאנשים סביבכם בעבודה?',
    },
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
          low: { analysis: 'העובד מרגיש כבול. חוסר אוטונומיה מוביל לשחיקה מהירה.', actions: ['הגדר את ה"מה" ושחרר את ה"איך"', 'שתף את העובד בקבלת החלטות'], aiTips: 'השבוע, בחר משימה אחת שאתה בדרך כלל בודק לעומק - והסתפק בקביעת התוצאה המצופה בלבד. תן לעובד לבחור את הדרך. בסוף השבוע, שאל אותו "מה למדת מהבחירה שלך?" במקום לבדוק את הביצוע.' },
          high: { analysis: 'העובד מרגיש אמון מלא. זהו מנוע צמיחה חזק.', actions: ['האצל סמכויות מורכבות יותר', 'הימנע ממעורבות יתר במשימות שגורות'], aiTips: 'הזמן הוא להעביר לעובד אחריות על תחום שלם, לא רק על משימות. הצע לו להוביל יוזמה חוצת-צוותים שדורשת מהמנהל "להזיז את הכיסא" - ולקדם אותו לתפקיד של שותף-בקבלת-החלטות.' }
        }
      },
      competence: {
        title: 'מסוגלות (יכולת והישגים)',
        employee: {
          low: { analysis: 'ייתכן שאתה מרגיש שהאתגרים גדולים מהכלים שיש לך כרגע.', actions: ['זהה צורך בהכשרה ובקש אותה', 'חגוג הצלחות קטנות ביום-יום'], aiTips: 'פרק משימות גדולות למשימות קטנות של 15 דקות. כל וי (V) קטן כזה בונה את תחושת המסוגלות שלך מחדש. חפש "למידת מיקרו" (Micro-learning) של 10 דקות ביום בנושא שמעניין אותך.' },
          high: { analysis: 'אתה מרגיש מקצועי, חד ובעל יכולת לתרום לצוות.', actions: ['חפש אתגרים חדשים שמותחים אותך', 'שמש כמנטור לעובדים אחרים'], aiTips: 'זה הזמן המושלם לבקש פרויקט "מתיחה" (Stretch Assignment) שיחשוף אותך לתחומים חדשים בארגון. היכולת שלך ללמד אחרים היא הדרך הטובה ביותר לשכלל את המומחיות שלך.' }
        },
        manager: {
          low: { analysis: 'העובד חווה תסכול או חשש מחוסר הצלחה.', actions: ['פרק משימות ליעדים קטנים וברי השגה', 'ספק משוב בונה ומיידי'], aiTips: 'השבוע, קבע פגישה של 20 דקות שבה לא מדברים על משימות, אלא רק על מיומנויות: "מה היית רוצה להיות טוב בו יותר?" ובנה איתו תוכנית למידה מיקרו של 15 דקות ביום. השקעה ביכולות = מנוע ביצועים לטווח ארוך.' },
          high: { analysis: 'העובד בטוח ביכולותיו ומספק תוצאות איכותיות.', actions: ['בדוק אפשרות לקידום או הרחבת אחריות', 'שבח את המיומנות הספציפית שלו'], aiTips: 'הצע לעובד "פרויקט מתיחה" שמוציא אותו מאזור הנוחות - אבל בתחום שהוא בטוח בו. הצמיחה האמיתית מגיעה כשעובד מצוין מתבקש ללמד אחרים. הפוך אותו למנטור של עמית חדש.' }
        }
      },
      relatedness: {
        title: 'שייכות (חיבור ומשמעות)',
        employee: {
          low: { analysis: 'אתה עשוי להרגיש מנותק חברתית או שהעבודה שלך לא מקבלת הערכה.', actions: ['יזום אינטראקציות חברתיות לא פורמליות', 'מצא שותף להתייעצות קבועה'], aiTips: 'קבע "קפה וירטואלי" או פיזי של 10 דקות עם קולגה שלא דיברת איתו מזמן. השיתוף בקשיים קטנים יכול לייצר חיבור מהיר ולהפחית את תחושת הבידוד.' },
          high: { analysis: 'אתה מרגיש חלק בלתי נפרד מהצוות וזוכה לתמיכה.', actions: ['חזק את הקשרים הקיימים', 'הייה הגורם המקשר לאחרים שמרגישים מחוץ לעניינים'], aiTips: 'השתמש בחיבור החזק שלך כדי לעזור לעובדים חדשים להיקלט. תחושת המשמעות שלך תגדל ככל שתהיה "הדבק" ששומר על הצוות מאוחד.' }
        },
        manager: {
          low: { analysis: 'העובד מרגיש מבודד. חוסר שייכות פוגע במחויבות.', actions: ['קבע פגישות 1:1 אישיות (לא רק על משימות)', 'שלב אותו בצוותי חשיבה משותפים'], aiTips: 'השבוע, פתח את ה-1:1 עם שאלה אישית: "מה תפס אותך השבוע מחוץ לעבודה?" - והקשב באמת. בנוסף, צור הזדמנות אחת לשיתוף פעולה לא-משימתי, כמו "ליצור יחד מצגת לצוות" - חיבור נוצר ביצירה משותפת, לא ביעדים.' },
          high: { analysis: 'העובד מחובר היטב לתרבות הארגונית ולצוות.', actions: ['המשך לטפח סביבה בטוחה ותומכת', 'הבע הערכה פומבית על תרומתו לצוות'], aiTips: 'השתמש בעובד המחובר כ"שגריר תרבות" - שלח אותו לקדם את הקליטה של עובדים חדשים. הבע הערכה ספציפית (לא כללית) פעם בשבועיים בפורום צוותי, ותציין מה בדיוק תרם הוא לסביבה החיובית.' }
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
    },
    // --- Phase 1: role selector ---
    roleSelectGreeting: 'היי {name}, מי אתה בעבודה?',
    roleSelectIntro: 'התשובה תעזור לנו להתאים לך את התובנות אחרי האבחון.',
    roleSolo: 'תורם/ת יחיד/ה',
    roleSoloDesc: 'מבצע/ת את העבודה, חלק/ה מצוות.',
    roleManager: 'מנהל/ת',
    roleManagerDesc: 'מוביל/ה אנשים שמבצעים את העבודה.',
    roleSelectCta: 'התחל אבחון',
    roleSelectContinueAs: 'המשך כ',
    roleSoloLabel: 'תורם/ת יחיד/ה',
    roleManagerLabel: 'מנהל/ת',
    // --- Phase 1: resume banner ---
    resumeBannerTitle: 'יש לך אבחון פתוח',
    resumeBannerText: 'התחלת אבחון ולא סיימת. רוצה להמשיך מאיפה שהפסקת?',
    resumeContinue: 'המשך',
    resumeStartFresh: 'התחל מחדש',
    // --- Phase 1: what's next strip ---
    whatsNextTitle: 'מה הצעד הבא?',
    whatsNextCopyTitle: 'העתק לעצמך',
    whatsNextCopyDesc: 'העתק את הדוח המלא והדבק לאן שנוח לך - יומן, פנקס, מסמך.',
    whatsNextShareTitle: 'שתף עם מנהל/צוות',
    whatsNextShareDesc: 'העתק עם פתיח מוכן לשליחה לאדם שחשוב לך לעדכן.',
    // --- Phase 1: share ---
    shareIntroLine: 'היי, ביצעתי אבחון מוטיבציה לפי מודל SDT. הנה התובנות שעלו:',
    // --- Phase 1: rating labels (mobile pills) ---
    rating1Label: 'בכלל לא מסכים/ה',
    rating2Label: 'לא מסכים/ה',
    rating3Label: 'ניטרלי/ת',
    rating4Label: 'מסכים/ה',
    rating5Label: 'מסכים/ה מאוד'
  },
  en: {
    dir: 'ltr',
    title: 'MotivationOS',
    subtitle: 'Workplace Insights',
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
    categoryIntroBtn: 'Ready!',
    categoryIntroLabel: 'Next section:',
    categoryIntroDesc: {
      autonomy: 'How free do you feel to choose how and when you work, and to express your own ideas?',
      competence: 'How skilled, confident, and professionally developed do you feel in your role?',
      relatedness: 'How connected, supported, and accepted do you feel by the people around you at work?',
    },
    categories: { autonomy: 'Autonomy', competence: 'Competence', relatedness: 'Relatedness' },
    deepAnalysis: {
      autonomy: {
        title: 'Autonomy',
        employee: {
          low: { analysis: 'It seems you feel micromanaged or lack the ability to influence your own schedule and workflows.', actions: ['Request a boundary-setting meeting', 'Suggest improvements to existing work processes'], aiTips: 'Try using "Time Blocking" to create independent workspace for yourself. In your next meeting with your manager, propose one task you can take full end-to-end responsibility for.' },
          high: { analysis: 'You have a strong sense of freedom and high ownership over your tasks and projects.', actions: ['Continue initiating new projects', 'Serve as a role model for self-management in the team'], aiTips: 'Leverage your freedom to research new tools that can upgrade team performance. This is the time to lead initiatives that go beyond your formal job description.' }
        },
        manager: {
          low: { analysis: 'Employee feels restricted. A lack of autonomy leads to rapid burnout.', actions: ["Define the 'what' and release the 'how'", "Involve the employee in decision-making processes"], aiTips: 'This week, pick one task you normally review in detail and only set the expected outcome. Let the employee choose the approach. At week\'s end, ask "What did you learn from your choice?" instead of checking execution — autonomy is built through trust experiments.' },
          high: { analysis: 'Employee feels fully trusted. This is a powerful growth engine.', actions: ['Delegate more complex authorities', 'Avoid over-involvement in routine tasks'], aiTips: 'Time to hand over ownership of an entire area, not just tasks. Offer them a cross-team initiative that requires you to step back — promote them to a "decision partner" role so their autonomy compounds into real influence.' }
        }
      },
      competence: {
        title: 'Competence',
        employee: {
          low: { analysis: 'You might feel that the current challenges are greater than the tools or training you have at your disposal.', actions: ['Identify specific training needs and request them', 'Celebrate small daily successes to build momentum'], aiTips: 'Break large tasks into 15-minute micro-tasks. Each small checkmark builds your sense of competence. Look for 10-minute "Micro-learning" daily on a topic that interests you.' },
          high: { analysis: 'You feel professional, sharp, and highly capable of delivering quality results for the team.', actions: ["Seek new 'stretch' challenges that push your limits", "Serve as a mentor for other team members"], aiTips: 'This is the perfect time to request a "Stretch Assignment" that exposes you to new areas of the organization. Your ability to teach others is the best way to further refine your own expertise.' }
        },
        manager: {
          low: { analysis: 'Employee is experiencing frustration or fear of failure.', actions: ['Break tasks into small, achievable goals', 'Provide constructive and immediate feedback'], aiTips: 'This week, schedule a 20-minute meeting with no task agenda — just skills: "What would you like to be better at?" Then co-build a 15-minute-a-day micro-learning plan. Investing in capability is the longest-leverage move you can make on motivation.' },
          high: { analysis: 'Employee is confident in their abilities and delivers high-quality results.', actions: ['Explore promotion or expanded responsibility', 'Praise their specific professional skills'], aiTips: 'Offer a stretch project just outside their comfort zone — but in a domain they trust themselves in. Real growth happens when a strong performer is asked to teach others. Pair them with a newer colleague as a mentor this quarter.' }
        }
      },
      relatedness: {
        title: 'Relatedness',
        employee: {
          low: { analysis: 'You may feel socially disconnected or that your contributions are not fully recognized by your peers.', actions: ['Initiate informal social interactions', 'Find a partner for regular professional consultation'], aiTips: 'Schedule a 10-minute "virtual or physical coffee" with a colleague you haven\'t spoken to in a while. Sharing small difficulties can create quick connections and reduce isolation.' },
          high: { analysis: 'You feel like an integral part of the team and receive genuine support from your colleagues.', actions: ['Strengthen existing connections', 'Be a bridge for others who might feel excluded'], aiTips: 'Use your strong connections to help new hires integrate. Your sense of meaning will grow as you become the "glue" that keeps the team united.' }
        },
        manager: {
          low: { analysis: 'Employee feels isolated. Lack of belonging harms commitment.', actions: ['Schedule personal 1:1 meetings (not just task-focused)', 'Include them in collaborative thinking groups'], aiTips: 'This week, open your 1:1 with a personal question — "What grabbed your attention outside of work this week?" — and listen for real. Then create one non-task collaboration like co-building a slide for the team. Connection grows through shared creation, not shared deadlines.' },
          high: { analysis: 'Employee is well-connected to the organizational culture and the team.', actions: ['Continue fostering a safe and supportive environment', 'Express public appreciation for their team contribution'], aiTips: 'Deploy this employee as a "culture ambassador" — have them own the onboarding of a new hire. Give specific (not generic) public appreciation every two weeks in a team forum, naming exactly what they contributed to the team\'s atmosphere.' }
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
    },
    // --- Phase 1: role selector ---
    roleSelectGreeting: 'Hi {name}, who are you at work?',
    roleSelectIntro: 'This helps us tailor your insights after the assessment.',
    roleSolo: 'Solo Contributor',
    roleSoloDesc: 'Doing the work, part of a team.',
    roleManager: 'Manager',
    roleManagerDesc: 'Leading people who do the work.',
    roleSelectCta: 'Start assessment',
    roleSelectContinueAs: 'Continue as',
    roleSoloLabel: 'Solo Contributor',
    roleManagerLabel: 'Manager',
    // --- Phase 1: resume banner ---
    resumeBannerTitle: 'You have an assessment in progress',
    resumeBannerText: 'You started an assessment and didn\'t finish. Want to pick up where you left off?',
    resumeContinue: 'Continue',
    resumeStartFresh: 'Start fresh',
    // --- Phase 1: what's next strip ---
    whatsNextTitle: 'What\'s next?',
    whatsNextCopyTitle: 'Copy for yourself',
    whatsNextCopyDesc: 'Copy the full report and paste it wherever works for you — journal, notes, doc.',
    whatsNextShareTitle: 'Share with your manager / team',
    whatsNextShareDesc: 'Copy with a ready-made intro line to send to someone who should know.',
    // --- Phase 1: share ---
    shareIntroLine: 'Hi, I just took a Self-Determination Theory motivation assessment. Here\'s what came up:',
    // --- Phase 1: rating labels (mobile pills) ---
    rating1Label: 'Strongly disagree',
    rating2Label: 'Disagree',
    rating3Label: 'Neutral',
    rating4Label: 'Agree',
    rating5Label: 'Strongly agree'
  }
};
