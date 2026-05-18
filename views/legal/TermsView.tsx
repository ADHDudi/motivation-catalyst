import React from 'react';
import LegalLayout from '../../components/LegalLayout';

const TermsView: React.FC = () => {
  return (
    <LegalLayout
      titleHe="תנאי שימוש"
      titleEn="Terms of Use"
      lastUpdated="עודכן: מאי 2025 | Updated: May 2025"
      sectionsHe={[
        {
          title: 'מבוא',
          body: (
            <p>
              ברוכים הבאים לפלטפורמת <strong>קתליזטור למוטיבציה</strong> — כלי חינמי להערכת מוטיבציה במקום העבודה,
              המבוסס על תיאוריית ההגדרה העצמית (Self-Determination Theory). השימוש בפלטפורמה מהווה הסכמה מלאה ובלתי
              מסויגת לתנאי השימוש המפורטים להלן. אם אינך מסכים לתנאים אלה, אנא הפסק את השימוש בפלטפורמה לאלתר.
              תנאים אלה חלים על כל גישה לפלטפורמה, לרבות דרך כל דפדפן, מכשיר קצה, או אמצעי אחר.
            </p>
          ),
        },
        {
          title: 'הגדרות',
          body: (
            <>
              <p>בתנאי שימוש אלה יחולו ההגדרות הבאות:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li><strong>"פלטפורמה"</strong> – אתר האינטרנט, האפליקציה, וכל שירות הנגיש דרכם תחת שם קתליזטור למוטיבציה.</li>
                <li><strong>"משתמש"</strong> – כל אדם הגולש בפלטפורמה, נרשם אליה, או עושה בה שימוש כלשהו.</li>
                <li><strong>"תוכן"</strong> – כל טקסט, גרפיקה, קוד, ממשק משתמש, מתודולוגיה, ועיצוב הכלולים בפלטפורמה.</li>
                <li><strong>"שאלון"</strong> – כלי ההערכה המובנה בפלטפורמה למדידת מוטיבציה במקום העבודה.</li>
                <li><strong>"תוצאות"</strong> – הפלט האישי המופק עבור המשתמש לאחר מילוי השאלון, לרבות ניתוח מבוסס בינה מלאכותית.</li>
              </ul>
            </>
          ),
        },
        {
          title: 'רישום וחשבון',
          body: (
            <>
              <p>בעת ההרשמה לפלטפורמה, המשתמש מצהיר ומתחייב כי:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>גילו <strong>18 שנים ומעלה</strong>. שימוש על ידי קטינים אסור ללא הסכמת הורה או אפוטרופוס.</li>
                <li>המידע שמסר בעת ההרשמה הוא <strong>מדויק, עדכני ומלא</strong>.</li>
                <li>הוא נושא ב<strong>אחריות מלאה</strong> לשמירת סודיות אמצעי הגישה לחשבונו (סיסמה, פרטי חשבון Google).</li>
                <li>לכל אדם מותרת <strong>פתיחת חשבון אחד בלבד</strong>. אסור להפעיל חשבונות כפולים.</li>
                <li>במקרה של חשד לגישה בלתי מורשית לחשבון, יש להודיע לנו מיד בכתובת tsur.david@gmail.com.</li>
              </ul>
            </>
          ),
        },
        {
          title: 'אזהרת תוכן',
          highlight: true,
          body: (
            <>
              <p>
                הפלטפורמה מציעה כלי הערכה עצמית בלבד. <strong>התוצאות אינן מהוות ייעוץ מקצועי</strong> מכל סוג שהוא —
                לא פסיכולוגי, לא ארגוני, לא משפטי, ולא אחר.
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>הכלי <strong>אינו מחליף</strong> טיפול פסיכולוגי, ייעוץ תעסוקתי, או קבלת החלטות מקצועית.</li>
                <li>התוצאות הן <strong>אינדיקטיביות בלבד</strong> ואינן מהוות אבחון קליני מוסמך.</li>
                <li>ניתוח ה-AI המובנה בפלטפורמה עשוי להכיל <strong>שגיאות או אי-דיוקים</strong>.</li>
                <li>כל החלטה המתקבלת על בסיס התוצאות נותרת <strong>באחריות המשתמש בלבד</strong>.</li>
                <li>אין לראות בתוצאות תעודה, הסמכה, או מסמך רשמי כלשהו.</li>
              </ul>
            </>
          ),
        },
        {
          title: 'שימוש מותר ואסור',
          body: (
            <>
              <p>השימוש בפלטפורמה מותר <strong>לשימוש אישי, לא מסחרי בלבד</strong>. במסגרת שימוש זה, אסור:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li><strong>שיתוף אישורי גישה</strong> עם אחרים או העברת חשבון לאדם אחר.</li>
                <li><strong>גרידת נתונים (scraping)</strong>, שאילתות אוטומטיות, או כל איסוף מידע שיטתי מהפלטפורמה.</li>
                <li><strong>שימוש מסחרי</strong> בתוכן, בתוצאות, או בכל חלק מהפלטפורמה ללא אישור מפורש בכתב.</li>
                <li><strong>ייחוס תוצאות הניתוח לאדם אחר</strong> שלא מילא את השאלון בעצמו.</li>
                <li>ניסיון לפרוץ, להפריע, או לפגוע בתשתית הפלטפורמה.</li>
                <li>שימוש בפלטפורמה לכל מטרה בלתי חוקית או בניגוד לתנאים אלה.</li>
              </ul>
            </>
          ),
        },
        {
          title: 'קניין רוחני',
          body: (
            <p>
              כל התוכן, העיצוב, הקוד, המתודולוגיה, הלוגואים, הטקסטים והממשקים הכלולים בפלטפורמה הם
              <strong> רכוש בלעדי של יוצר הפלטפורמה</strong> ומוגנים על ידי דיני זכויות יוצרים וקניין רוחני
              החלים בישראל ובמדינות אחרות. אין להעתיק, לשכפל, להפיץ, לפרסם מחדש, לתרגם, ליצור יצירות נגזרות,
              או לעשות שימוש מסחרי בכל חלק מהתוכן ללא קבלת רשות מפורשת בכתב מיוצר הפלטפורמה. שימוש שאינו
              מורשה עלול להוות הפרה של דיני זכויות יוצרים ויחשוף את המפר לתביעות אזרחיות ופליליות.
            </p>
          ),
        },
        {
          title: 'הגבלת אחריות',
          body: (
            <>
              <p>
                הפלטפורמה מסופקת <strong>"כמו שהיא" (AS IS)</strong>, ללא כל אחריות מפורשת או משתמעת מכל סוג שהוא.
                היוצר אינו מתחייב לזמינות רציפה, לדיוק התוצאות, או לתאימות הפלטפורמה לכל מטרה ספציפית.
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>היוצר לא יישא באחריות לכל <strong>נזק ישיר, עקיף, מקרי, מיוחד או תוצאתי</strong> הנובע מהשימוש בפלטפורמה.</li>
                <li>האחריות המקסימלית של היוצר בכל מקרה מוגבלת לסכום ששולם על ידי המשתמש עבור השירות — ומאחר שהשירות הוא <strong>חינמי לחלוטין</strong>, האחריות היא אפס.</li>
                <li>היוצר אינו אחראי לתקלות, הפרעות, או אובדן נתונים הנובעים מגורמים שאינם בשליטתו.</li>
              </ul>
            </>
          ),
        },
        {
          title: 'שינוי תנאים',
          body: (
            <p>
              היוצר שומר לעצמו את הזכות לשנות, לעדכן, או להחליף תנאי שימוש אלה בכל עת, לפי שיקול דעתו הבלעדי.
              שינויים מהותיים יפורסמו בפלטפורמה ויצוין תאריך עדכון בראש מסמך זה. <strong>המשך השימוש בפלטפורמה
              לאחר פרסום עדכון מהווה הסכמה לתנאים החדשים</strong>. אם אינך מסכים לשינויים, עליך להפסיק את
              השימוש בפלטפורמה. מומלץ לבדוק תנאים אלה מעת לעת.
            </p>
          ),
        },
        {
          title: 'דין חל וסמכות שיפוטית',
          body: (
            <p>
              תנאי שימוש אלה יפורשו ויוחלו בהתאם ל<strong>דיני מדינת ישראל</strong>, ללא תלות בכללי ברירת הדין.
              כל סכסוך הנובע מהשימוש בפלטפורמה או מתנאי שימוש אלה יובא לדיון בפני <strong>בתי המשפט המוסמכים
              במחוז תל אביב-יפו</strong> בלבד, וכל צד מסכים מראש לסמכות השיפוט הבלעדית שלהם.
            </p>
          ),
        },
        {
          title: 'צור קשר',
          body: (
            <p>
              לכל שאלה, הבהרה, או פנייה הנוגעת לתנאי שימוש אלה, ניתן לפנות אלינו בכתובת הדוא"ל:{' '}
              <a
                href="mailto:tsur.david@gmail.com"
                className="font-bold underline"
                style={{ color: 'var(--b2c-azure)' }}
              >
                tsur.david@gmail.com
              </a>
              . נשתדל להשיב בהקדם האפשרי.
            </p>
          ),
        },
      ]}
      sectionsEn={[
        {
          title: 'Introduction',
          body: (
            <p>
              Welcome to <strong>Motivation Catalyst</strong> — a free workplace motivation assessment tool
              based on Self-Determination Theory (SDT). By accessing or using this platform in any way, you
              agree to be fully and unconditionally bound by these Terms of Use. If you do not agree to these
              terms, please discontinue your use of the platform immediately. These terms apply to all access
              to the platform, including through any browser, device, or other means.
            </p>
          ),
        },
        {
          title: 'Definitions',
          body: (
            <>
              <p>In these Terms of Use, the following definitions apply:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li><strong>"Platform"</strong> – the website, application, and all services accessible under the Motivation Catalyst name.</li>
                <li><strong>"User"</strong> – any person who browses, registers on, or makes any use of the platform.</li>
                <li><strong>"Content"</strong> – all text, graphics, code, user interface, methodology, and design contained within the platform.</li>
                <li><strong>"Assessment"</strong> – the built-in evaluation tool used to measure workplace motivation.</li>
                <li><strong>"Results"</strong> – the personal output generated for a user after completing the assessment, including any AI-powered analysis.</li>
              </ul>
            </>
          ),
        },
        {
          title: 'Account Registration',
          body: (
            <>
              <p>When registering for the platform, users represent and warrant that:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>They are at least <strong>18 years of age</strong>. Use by minors is prohibited without parental or guardian consent.</li>
                <li>All information provided during registration is <strong>accurate, current, and complete</strong>.</li>
                <li>They bear <strong>full responsibility</strong> for maintaining the confidentiality of their account credentials (password, Google account details).</li>
                <li>Each individual may maintain <strong>only one account</strong>. Duplicate accounts are not permitted.</li>
                <li>In the event of suspected unauthorized access to their account, users must notify us immediately at tsur.david@gmail.com.</li>
              </ul>
            </>
          ),
        },
        {
          title: 'Content Disclaimer',
          highlight: true,
          body: (
            <>
              <p>
                The platform provides a <strong>self-assessment tool only</strong>. The results do not constitute
                professional advice of any kind — psychological, organizational, legal, or otherwise.
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>This tool is <strong>not a substitute</strong> for psychological therapy, career counseling, or professional decision-making.</li>
                <li>Results are <strong>indicative only</strong> and do not constitute a certified clinical diagnosis.</li>
                <li>The AI-powered analysis built into the platform may contain <strong>errors or inaccuracies</strong>.</li>
                <li>Any decision made based on the results remains the <strong>sole responsibility of the user</strong>.</li>
                <li>Results should not be treated as a certificate, credential, or any form of official document.</li>
              </ul>
            </>
          ),
        },
        {
          title: 'Permitted & Prohibited Use',
          body: (
            <>
              <p>Use of the platform is permitted for <strong>personal, non-commercial purposes only</strong>. The following are strictly prohibited:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li><strong>Sharing account credentials</strong> with others or transferring your account to another person.</li>
                <li><strong>Data scraping</strong>, automated queries, or any systematic collection of information from the platform.</li>
                <li><strong>Commercial use</strong> of content, results, or any part of the platform without explicit written authorization.</li>
                <li><strong>Attributing assessment results to another person</strong> who did not personally complete the assessment.</li>
                <li>Attempting to breach, disrupt, or damage the platform's infrastructure.</li>
                <li>Using the platform for any unlawful purpose or in violation of these terms.</li>
              </ul>
            </>
          ),
        },
        {
          title: 'Intellectual Property',
          body: (
            <p>
              All content, design, code, methodology, logos, text, and interfaces contained within the platform
              are the <strong>exclusive property of the platform's creator</strong> and are protected by copyright
              and intellectual property laws applicable in Israel and internationally. No part of the content may
              be copied, reproduced, distributed, republished, translated, adapted, or used commercially without
              obtaining prior explicit written permission from the creator. Unauthorized use may constitute
              copyright infringement and may expose the infringer to civil and criminal liability.
            </p>
          ),
        },
        {
          title: 'Limitation of Liability',
          body: (
            <>
              <p>
                The platform is provided <strong>"AS IS"</strong>, without any warranty of any kind, express or
                implied. The creator makes no guarantees regarding continuous availability, accuracy of results,
                or the suitability of the platform for any specific purpose.
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>The creator shall not be liable for any <strong>direct, indirect, incidental, special, or consequential damages</strong> arising from use of the platform.</li>
                <li>The creator's maximum liability in any case is limited to the amount paid by the user for the service — and since this service is <strong>entirely free</strong>, that liability is zero.</li>
                <li>The creator is not responsible for outages, interruptions, or data loss resulting from factors beyond their control.</li>
              </ul>
            </>
          ),
        },
        {
          title: 'Modifications to Terms',
          body: (
            <p>
              The creator reserves the right to change, update, or replace these Terms of Use at any time, at
              their sole discretion. Material changes will be published on the platform, and the update date at
              the top of this document will be revised accordingly. <strong>Continued use of the platform after
              an update is published constitutes acceptance of the new terms.</strong> If you do not agree to the
              changes, you must discontinue use of the platform. We recommend reviewing these terms periodically.
            </p>
          ),
        },
        {
          title: 'Governing Law & Jurisdiction',
          body: (
            <p>
              These Terms of Use shall be interpreted and enforced in accordance with the <strong>laws of the
              State of Israel</strong>, without regard to conflict-of-law principles. Any dispute arising from
              the use of the platform or from these Terms of Use shall be submitted exclusively to the
              <strong> competent courts of the Tel Aviv-Yafo District</strong>, and each party hereby irrevocably
              consents to their exclusive jurisdiction.
            </p>
          ),
        },
        {
          title: 'Contact',
          body: (
            <p>
              For any questions, clarifications, or inquiries relating to these Terms of Use, please contact us
              at:{' '}
              <a
                href="mailto:tsur.david@gmail.com"
                className="font-bold underline"
                style={{ color: 'var(--b2c-azure)' }}
              >
                tsur.david@gmail.com
              </a>
              . We will do our best to respond as promptly as possible.
            </p>
          ),
        },
      ]}
    />
  );
};

export default TermsView;
