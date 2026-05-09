import React from 'react';
import LegalLayout from '../../components/LegalLayout';

const PrivacyView: React.FC = () => {
  return (
    <LegalLayout
      titleHe="מדיניות פרטיות"
      titleEn="Privacy Policy"
      lastUpdated="עודכן: מאי 2025 | Updated: May 2025"
      sectionsHe={[
        {
          title: 'מבוא',
          body: (
            <>
              <p>
                קתליזטור למוטיבציה ("האפליקציה", "אנחנו") הוא כלי חינמי להערכת מוטיבציה בעבודה, המבוסס על תיאוריית ההגדרה העצמית (Self-Determination Theory). מדיניות פרטיות זו מסבירה כיצד אנו אוספים, משתמשים ומגנים על המידע האישי שלך בעת השימוש בשירות.
              </p>
              <p>
                <strong>האחראי על עיבוד הנתונים:</strong> דוד צור, tsur.david@gmail.com.
              </p>
              <p>
                מדיניות זו חלה על כל המידע שנאסף דרך האפליקציה, לרבות תהליך ההרשמה, מילוי השאלון וקבלת ניתוח התוצאות. <strong>השימוש באפליקציה מהווה הסכמה לאיסוף ועיבוד המידע כמתואר במדיניות זו.</strong>
              </p>
            </>
          ),
        },
        {
          title: 'מידע שאנו אוספים',
          body: (
            <>
              <p>אנו אוספים את סוגי המידע הבאים:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>
                  <strong>(א) מזהים אישיים:</strong> שם תצוגה וכתובת אימייל, הנאספים בעת יצירת חשבון או כניסה לאפליקציה.
                </li>
                <li>
                  <strong>(ב) נתוני חשבון:</strong> אם נכנסת דרך חשבון Google, נאסף token של Google OAuth לצורך אימות. <strong>אנו לא שומרים סיסמאות</strong> — ניהול הסיסמאות נעשה אך ורק על ידי Firebase Authentication.
                </li>
                <li>
                  <strong>(ג) נתוני שאלון:</strong> תשובותיך לשאלות השאלון (דירוגים בסולם 1–5) ותוצאות הניתוח שהופקו עבורך.
                </li>
                <li>
                  <strong>(ד) נתוני משוב:</strong> דירוג אופציונלי ותגובה חופשית שתבחר להשאיר לאחר קבלת הניתוח.
                </li>
                <li>
                  <strong>(ה) נתונים טכניים:</strong> כתובת IP, User-Agent (סוג הדפדפן ומערכת ההפעלה) ומידע על הסשן, הנאספים באופן אוטומטי על ידי Firebase.
                </li>
              </ul>
            </>
          ),
        },
        {
          title: 'כיצד אנו משתמשים במידע',
          body: (
            <>
              <p>המידע שנאסף משמש לצרכים הבאים בלבד:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>
                  <strong>הפעלת השירות:</strong> עיבוד תשובות השאלון והפקת ניתוח מוטיבציה מותאם אישית באמצעות Gemini AI.
                </li>
                <li>
                  <strong>ניהול חשבון:</strong> זיהוי המשתמש, שמירת היסטוריית ניתוחים ואפשרות להתחבר מחדש לחשבון.
                </li>
                <li>
                  <strong>שיפור השירות:</strong> ניתוח נתוני משוב אנונימיים לשם שיפור חוויית המשתמש ואיכות הניתוחים.
                </li>
                <li>
                  <strong>אבטחה ומניעת שימוש לרעה:</strong> ניטור ואיתור פעילות חריגה כדי להגן על המשתמשים ועל המערכת.
                </li>
              </ul>
              <p className="mt-2">
                <strong>אנו לא מוכרים, מעבירים או משתפים את המידע האישי שלך עם צדדים שלישיים למטרות שיווק.</strong>
              </p>
            </>
          ),
        },
        {
          title: 'שירותי צד שלישי',
          highlight: true,
          body: (
            <>
              <p className="mb-3">
                האפליקציה עושה שימוש בשירותי צד שלישי הבאים לצורך הפעלתה. העברת נתונים מישראל לארצות הברית מתבצעת בהתאם לחוק הגנת הפרטיות התשמ"א-1981 ותקנות הגנת הפרטיות (אבטחת מידע) תשע"ז-2017.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="border border-slate-200 p-2 text-right font-bold">שירות</th>
                      <th className="border border-slate-200 p-2 text-right font-bold">מטרה</th>
                      <th className="border border-slate-200 p-2 text-right font-bold">ספק</th>
                      <th className="border border-slate-200 p-2 text-right font-bold">מיקום שרתים</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-200 p-2">Firebase Authentication</td>
                      <td className="border border-slate-200 p-2">אימות משתמשים (Google OAuth + אימייל/סיסמה)</td>
                      <td className="border border-slate-200 p-2">Google LLC</td>
                      <td className="border border-slate-200 p-2">ארצות הברית</td>
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="border border-slate-200 p-2">Firebase Firestore</td>
                      <td className="border border-slate-200 p-2">אחסון נתוני משוב</td>
                      <td className="border border-slate-200 p-2">Google LLC</td>
                      <td className="border border-slate-200 p-2">ארצות הברית</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-200 p-2">Firebase Cloud Functions + Gemini AI</td>
                      <td className="border border-slate-200 p-2">עיבוד וניתוח תשובות השאלון</td>
                      <td className="border border-slate-200 p-2">Google LLC</td>
                      <td className="border border-slate-200 p-2">ארצות הברית</td>
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="border border-slate-200 p-2">Google Fonts</td>
                      <td className="border border-slate-200 p-2">טעינת גופן Heebo</td>
                      <td className="border border-slate-200 p-2">Google LLC</td>
                      <td className="border border-slate-200 p-2">CDN גלובלי</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3">
                לפרטים נוספים על מדיניות הפרטיות של Google, ראה:{' '}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                  style={{ color: 'var(--b2c-azure)' }}
                >
                  policies.google.com/privacy
                </a>
              </p>
            </>
          ),
        },
        {
          title: 'אבטחת מידע',
          body: (
            <>
              <p>אנו נוקטים באמצעים הבאים להגנה על המידע שלך:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>
                  <strong>הצפנה בעת העברה:</strong> כל התקשורת בין הדפדפן לשרתים מוצפנת באמצעות TLS (HTTPS).
                </li>
                <li>
                  <strong>אחסון מאובטח:</strong> הנתונים מאוחסנים בתשתית Firebase של Google, העומדת בתקני אבטחה בינלאומיים (ISO 27001, SOC 2).
                </li>
                <li>
                  <strong>ללא אחסון סיסמאות:</strong> סיסמאות לעולם אינן מאוחסנות על ידינו. הן מנוהלות אך ורק על ידי Firebase Authentication.
                </li>
                <li>
                  <strong>ביקורת אוטומטית:</strong> Firebase מבצעת ביקורות אבטחה אוטומטיות ועדכוני אבטחה שוטפים.
                </li>
              </ul>
              <p className="mt-2">
                <strong>חשוב לציין:</strong> אין מערכת מאובטחת ב-100%. למרות מאמצינו, לא ניתן לערוב לאבטחה מוחלטת של מידע המועבר דרך האינטרנט.
              </p>
            </>
          ),
        },
        {
          title: 'שמירת נתונים',
          body: (
            <>
              <p>אנו שומרים מידע בהתאם למדיניות הבאה:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>
                  <strong>נתוני חשבון:</strong> נשמרים עד לבקשת מחיקת החשבון על ידי המשתמש.
                </li>
                <li>
                  <strong>נתוני שאלון וניתוח:</strong> נשמרים עד לבקשת מחיקה, ולא יותר מאשר 12 חודשים לאחר הכניסה האחרונה.
                </li>
                <li>
                  <strong>נתוני משוב:</strong> נשמרים למשך 12 חודשים ממועד הגשתם.
                </li>
                <li>
                  <strong>יומני Firebase:</strong> נשמרים באופן אוטומטי למשך 90 יום בהתאם למדיניות Firebase.
                </li>
              </ul>
              <p className="mt-2">
                לאחר מחיקת חשבון או בקשת מחיקת נתונים, <strong>כל המידע האישי המזהה יימחק תוך 30 ימי עסקים</strong>, בכפוף לדרישות חוק.
              </p>
            </>
          ),
        },
        {
          title: 'זכויות המשתמש',
          body: (
            <>
              <p>
                בהתאם לחוק הגנת הפרטיות התשמ"א-1981 ותקנות הגנת הפרטיות (אבטחת מידע) תשע"ז-2017, עומדות לך הזכויות הבאות:
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>
                  <strong>זכות עיון:</strong> לקבל מידע אודות הנתונים האישיים שאנו מחזיקים עליך.
                </li>
                <li>
                  <strong>זכות תיקון:</strong> לבקש תיקון של מידע שגוי או בלתי שלם.
                </li>
                <li>
                  <strong>זכות מחיקה:</strong> לבקש מחיקת המידע האישי שלך ממאגרי הנתונים שלנו.
                </li>
                <li>
                  <strong>זכות התנגדות לשיווק:</strong> להתנגד לשימוש במידע שלך לצורכי שיווק ישיר (כפי שצוין, איננו עושים שימוש כזה).
                </li>
              </ul>
              <p className="mt-2">
                לממש את זכויותיך, אנא פנה אלינו בדוא"ל:{' '}
                <a
                  href="mailto:tsur.david@gmail.com"
                  className="underline"
                  style={{ color: 'var(--b2c-azure)' }}
                >
                  tsur.david@gmail.com
                </a>
                . <strong>נשיב לבקשתך תוך 30 ימי עסקים.</strong>
              </p>
            </>
          ),
        },
        {
          title: 'עוגיות (Cookies)',
          body: (
            <>
              <p>
                האפליקציה עושה שימוש מוגבל בעוגיות (cookies) ובאחסון מקומי:
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>
                  <strong>עוגיות פונקציונליות של Firebase:</strong> Firebase Authentication משתמשת בעוגיות session לניהול מצב ההתחברות. עוגיות אלו חיוניות לפעולת האפליקציה ואינן ניתנות להשבתה.
                </li>
              </ul>
              <p className="mt-2">
                <strong>אנו לא משתמשים בעוגיות שיווקיות, עוגיות מעקב, ניתוח התנהגות, או כל עוגייה שאינה הכרחית לפעולת השירות.</strong>
              </p>
            </>
          ),
        },
        {
          title: 'שינויים במדיניות הפרטיות',
          body: (
            <>
              <p>
                אנו עשויים לעדכן מדיניות פרטיות זו מעת לעת. במקרה של שינויים מהותיים:
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>תוצג הודעה בולטת בממשק האפליקציה.</li>
                <li>תאריך "עודכן" בראש הדף יתעדכן.</li>
              </ul>
              <p className="mt-2">
                <strong>המשך השימוש באפליקציה לאחר פרסום השינויים מהווה הסכמה למדיניות המעודכנת.</strong> אם אינך מסכים לשינויים, עליך להפסיק את השימוש באפליקציה ולבקש מחיקת חשבונך.
              </p>
            </>
          ),
        },
        {
          title: 'צור קשר',
          body: (
            <>
              <p>לשאלות, בקשות או פניות בנוגע למדיניות פרטיות זו ולנתונים האישיים שלך, ניתן לפנות אלינו:</p>
              <p className="mt-2">
                <strong>דוא"ל:</strong>{' '}
                <a
                  href="mailto:tsur.david@gmail.com"
                  className="underline"
                  style={{ color: 'var(--b2c-azure)' }}
                >
                  tsur.david@gmail.com
                </a>
              </p>
              <p className="mt-1">נשיב לכל פניה תוך 30 ימי עסקים.</p>
            </>
          ),
        },
      ]}
      sectionsEn={[
        {
          title: 'Introduction',
          body: (
            <>
              <p>
                Motivation Catalyst ("the App", "we", "us") is a free workplace motivation assessment tool based on Self-Determination Theory (SDT). This Privacy Policy explains how we collect, use, and protect your personal information when you use our service.
              </p>
              <p>
                <strong>Data controller:</strong> David Tsur, tsur.david@gmail.com.
              </p>
              <p>
                This policy applies to all information collected through the App, including the registration process, completing the assessment, and receiving your analysis results. <strong>By using the App, you consent to the collection and processing of information as described in this policy.</strong>
              </p>
            </>
          ),
        },
        {
          title: 'Information We Collect',
          body: (
            <>
              <p>We collect the following categories of information:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>
                  <strong>(a) Identifiers:</strong> Display name and email address, collected when you create an account or sign in to the App.
                </li>
                <li>
                  <strong>(b) Account data:</strong> If you sign in via Google, a Google OAuth token is collected for authentication purposes. <strong>We never store passwords</strong> — password management is handled exclusively by Firebase Authentication.
                </li>
                <li>
                  <strong>(c) Assessment data:</strong> Your answers to the assessment questionnaire (ratings on a 1–5 scale) and the analysis results generated for you.
                </li>
                <li>
                  <strong>(d) Feedback data:</strong> An optional rating and free-text comment you may choose to submit after receiving your analysis.
                </li>
                <li>
                  <strong>(e) Technical data:</strong> IP address, User-Agent (browser type and operating system), and session information, collected automatically by Firebase.
                </li>
              </ul>
            </>
          ),
        },
        {
          title: 'How We Use Information',
          body: (
            <>
              <p>The information collected is used solely for the following purposes:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>
                  <strong>Delivering the service:</strong> Processing your assessment answers and generating a personalized motivation analysis using Gemini AI.
                </li>
                <li>
                  <strong>Account management:</strong> Identifying you as a user, preserving your analysis history, and enabling you to sign back in to your account.
                </li>
                <li>
                  <strong>Service improvement:</strong> Analyzing anonymized feedback data to improve user experience and analysis quality.
                </li>
                <li>
                  <strong>Security and abuse prevention:</strong> Monitoring and detecting anomalous activity to protect users and the system.
                </li>
              </ul>
              <p className="mt-2">
                <strong>We do not sell, transfer, or share your personal information with third parties for marketing purposes.</strong>
              </p>
            </>
          ),
        },
        {
          title: 'Third-Party Services',
          highlight: true,
          body: (
            <>
              <p className="mb-3">
                The App relies on the following third-party services to operate. Cross-border transfers of personal data from Israel to the United States are made in accordance with the Israeli Privacy Protection Law 5741-1981 and the Privacy Protection Regulations (Data Security) 5777-2017.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="border border-slate-200 p-2 text-left font-bold">Service</th>
                      <th className="border border-slate-200 p-2 text-left font-bold">Purpose</th>
                      <th className="border border-slate-200 p-2 text-left font-bold">Provider</th>
                      <th className="border border-slate-200 p-2 text-left font-bold">Server Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-200 p-2">Firebase Authentication</td>
                      <td className="border border-slate-200 p-2">User authentication (Google OAuth + email/password)</td>
                      <td className="border border-slate-200 p-2">Google LLC</td>
                      <td className="border border-slate-200 p-2">United States</td>
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="border border-slate-200 p-2">Firebase Firestore</td>
                      <td className="border border-slate-200 p-2">Feedback data storage</td>
                      <td className="border border-slate-200 p-2">Google LLC</td>
                      <td className="border border-slate-200 p-2">United States</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-200 p-2">Firebase Cloud Functions + Gemini AI</td>
                      <td className="border border-slate-200 p-2">Assessment processing and analysis</td>
                      <td className="border border-slate-200 p-2">Google LLC</td>
                      <td className="border border-slate-200 p-2">United States</td>
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="border border-slate-200 p-2">Google Fonts</td>
                      <td className="border border-slate-200 p-2">Loading the Heebo typeface</td>
                      <td className="border border-slate-200 p-2">Google LLC</td>
                      <td className="border border-slate-200 p-2">Global CDN</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3">
                For more information about Google's privacy practices, see:{' '}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                  style={{ color: 'var(--b2c-azure)' }}
                >
                  policies.google.com/privacy
                </a>
              </p>
            </>
          ),
        },
        {
          title: 'Data Security',
          body: (
            <>
              <p>We take the following measures to protect your information:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>
                  <strong>Encryption in transit:</strong> All communication between your browser and our servers is encrypted using TLS (HTTPS).
                </li>
                <li>
                  <strong>Secure storage:</strong> Data is stored on Google's Firebase infrastructure, which meets international security standards (ISO 27001, SOC 2).
                </li>
                <li>
                  <strong>No local password storage:</strong> Passwords are never stored by us. They are managed exclusively by Firebase Authentication.
                </li>
                <li>
                  <strong>Automated security auditing:</strong> Firebase performs automated security reviews and applies regular security updates.
                </li>
              </ul>
              <p className="mt-2">
                <strong>Please note:</strong> No system is 100% secure. Despite our efforts, we cannot guarantee the absolute security of information transmitted over the internet.
              </p>
            </>
          ),
        },
        {
          title: 'Data Retention',
          body: (
            <>
              <p>We retain information according to the following policy:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>
                  <strong>Account data:</strong> Retained until the user requests account deletion.
                </li>
                <li>
                  <strong>Assessment and analysis data:</strong> Retained until a deletion request is received, and no longer than 12 months after the last sign-in.
                </li>
                <li>
                  <strong>Feedback data:</strong> Retained for 12 months from the date of submission.
                </li>
                <li>
                  <strong>Firebase logs:</strong> Automatically retained for 90 days in accordance with Firebase's default log retention policy.
                </li>
              </ul>
              <p className="mt-2">
                After account deletion or a data deletion request, <strong>all personally identifiable information will be deleted within 30 business days</strong>, subject to applicable legal requirements.
              </p>
            </>
          ),
        },
        {
          title: 'Your Rights',
          body: (
            <>
              <p>
                Under the Israeli Privacy Protection Law 5741-1981 and the Privacy Protection Regulations (Data Security) 5777-2017, you have the following rights:
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>
                  <strong>Right of access:</strong> To receive information about the personal data we hold about you.
                </li>
                <li>
                  <strong>Right of correction:</strong> To request correction of inaccurate or incomplete information.
                </li>
                <li>
                  <strong>Right of deletion:</strong> To request deletion of your personal information from our databases.
                </li>
                <li>
                  <strong>Right to object to marketing:</strong> To object to the use of your data for direct marketing purposes (as noted above, we do not engage in such use).
                </li>
              </ul>
              <p className="mt-2">
                To exercise your rights, please contact us at:{' '}
                <a
                  href="mailto:tsur.david@gmail.com"
                  className="underline"
                  style={{ color: 'var(--b2c-azure)' }}
                >
                  tsur.david@gmail.com
                </a>
                . <strong>We will respond to your request within 30 business days.</strong>
              </p>
            </>
          ),
        },
        {
          title: 'Cookies',
          body: (
            <>
              <p>The App makes limited use of cookies and local storage:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>
                  <strong>Firebase functional session cookies:</strong> Firebase Authentication uses session cookies to manage your signed-in state. These cookies are strictly necessary for the App to function and cannot be disabled.
                </li>
              </ul>
              <p className="mt-2">
                <strong>We do not use marketing cookies, tracking cookies, behavioral analytics cookies, or any cookies that are not strictly necessary for the operation of the service.</strong>
              </p>
            </>
          ),
        },
        {
          title: 'Policy Changes',
          body: (
            <>
              <p>We may update this Privacy Policy from time to time. In the event of material changes:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>A prominent notice will be displayed within the App's interface.</li>
                <li>The "Updated" date at the top of this page will be revised.</li>
              </ul>
              <p className="mt-2">
                <strong>Continued use of the App after changes are published constitutes your acceptance of the updated policy.</strong> If you do not agree to the changes, you should discontinue use of the App and request deletion of your account.
              </p>
            </>
          ),
        },
        {
          title: 'Contact',
          body: (
            <>
              <p>For questions, requests, or inquiries regarding this Privacy Policy or your personal data, please contact us:</p>
              <p className="mt-2">
                <strong>Email:</strong>{' '}
                <a
                  href="mailto:tsur.david@gmail.com"
                  className="underline"
                  style={{ color: 'var(--b2c-azure)' }}
                >
                  tsur.david@gmail.com
                </a>
              </p>
              <p className="mt-1">We will respond to all inquiries within 30 business days.</p>
            </>
          ),
        },
      ]}
    />
  );
};

export default PrivacyView;
