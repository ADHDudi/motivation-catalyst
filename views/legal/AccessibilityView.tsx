import React from 'react';
import LegalLayout from '../../components/LegalLayout';

const AccessibilityView: React.FC = () => {
  return (
    <LegalLayout
      titleHe="הצהרת נגישות"
      titleEn="Accessibility Statement"
      lastUpdated="עודכן: מאי 2025 | Updated: May 2025"
      sectionsHe={[
        {
          title: 'מחויבות לנגישות',
          body: (
            <>
              <p>
                אפליקציית <strong>קתליזטור למוטיבציה</strong> מחויבת לנגישות לכלל המשתמשים,
                כולל אנשים עם מוגבלויות. אנו פועלים להסיר חסמים ולהבטיח חוויית שימוש שוויונית.
              </p>
              <p>
                <strong>הבסיס החוקי:</strong> תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות
                נגישות לשירות), תשע"ג-2013, תקנה 35, ותקן ישראלי IS 5568 ברמה AA.
              </p>
              <p>עדכון אחרון: מאי 2025.</p>
            </>
          ),
        },
        {
          title: 'התאמות נגישות שבוצעו',
          body: (
            <>
              <p>ביצענו את ההתאמות הבאות כדי לשפר את נגישות האפליקציה:</p>
              <ul>
                <li>
                  <strong>ניווט מקלדת מלא</strong> — Tab / Shift+Tab / Enter / Escape לניווט
                  בין כל רכיבי הממשק הניתנים לפעולה.
                </li>
                <li>
                  <strong>תמיכה מלאה ב-RTL (עברית)</strong> — כיוון הדף מוגדר עברית מימין
                  לשמאל בכל מסכי האפליקציה.
                </li>
                <li>
                  <strong>HTML סמנטי</strong> — שימוש ברכיבים מובנים: <code>button</code>,{' '}
                  <code>form</code>, <code>label</code>, <code>ul</code>, <code>li</code>.
                </li>
                <li>
                  <strong>תוויות שדות טופס</strong> — כל שדה קלט מקושר לתווית{' '}
                  <code>label</code> מפורשת.
                </li>
                <li>
                  <strong>גופן Heebo</strong> קריא עם גודל בסיס 14–16px ו-fallback לגופן מערכת.
                </li>
                <li>
                  <strong>הגדלת טקסט עד 200%</strong> ללא אובדן תוכן או פגיעה בפונקציונליות.
                </li>
                <li>
                  <strong>ניגודיות צבעים בסיסית WCAG AA</strong> עבור טקסט ראשי (כחול
                  #1F7AFF על רקע לבן).
                </li>
                <li>
                  <strong>עיצוב רספונסיבי</strong> — האפליקציה שמישה במובייל, טאבלט ומחשב.
                </li>
              </ul>
            </>
          ),
        },
        {
          title: 'תקן ומסגרת',
          body: (
            <>
              <p>
                הממשק מיועד לעמוד בתקן ישראלי <strong>IS 5568 ברמה AA</strong>, המקביל
                ל-WCAG 2.1 AA של W3C.
              </p>
              <p>
                הבדיקה בוצעה באמצעות כלי <strong>Lighthouse</strong> בדפדפן Chrome. לא
                בוצעה בדיקה פורמלית עם קורא מסך.
              </p>
            </>
          ),
        },
        {
          title: 'מגבלות ידועות',
          highlight: true,
          body: (
            <>
              <p>להלן מגבלות נגישות ידועות שעדיין לא טופלו במלואן:</p>
              <ul>
                <li>
                  <strong>(א) תרשים הרדאר (polar chart)</strong> בתצוגת התוצאות אינו מלווה
                  בטבלת נתונים טקסטואלית כחלופה — <strong>תיקון מתוכנן</strong>.
                </li>
                <li>
                  <strong>(ב) ניגודיות טקסט משני</strong> — טקסט אפור בהיר (slate-400) עשוי
                  שלא לעמוד בדרישות WCAG AA במלואן בגדלים קטנים.
                </li>
                <li>
                  <strong>(ג) בדיקת קורא מסך</strong> — לא בוצעה בדיקה מקיפה עם קורא מסך
                  (NVDA / JAWS / VoiceOver).
                </li>
                <li>
                  <strong>(ד) תוכן מולטימדיה</strong> — אין תוכן אודיו או וידאו באפליקציה;
                  לכן כתוביות אינן רלוונטיות.
                </li>
              </ul>
            </>
          ),
        },
        {
          title: 'פנייה בנושאי נגישות',
          body: (
            <>
              <p>
                לדיווח על בעיית נגישות, בקשת מידע בנושא נגישות, או בקשה להתאמה אישית, ניתן
                לפנות אלינו בדוא"ל:
              </p>
              <p>
                <strong>
                  <a href="mailto:tsur.david@gmail.com">tsur.david@gmail.com</a>
                </strong>
              </p>
              <p>
                נשתדל להגיב תוך <strong>7 ימי עסקים</strong>. תיקון ליקויים שזוהו יבוצע תוך{' '}
                <strong>60 יום</strong>, בהתאם לתקנות.
              </p>
            </>
          ),
        },
      ]}
      sectionsEn={[
        {
          title: 'Accessibility Commitment',
          body: (
            <>
              <p>
                <strong>Motivation Catalyst</strong> is committed to accessibility for all
                users, including people with disabilities. We work to remove barriers and
                ensure an equal experience for everyone.
              </p>
              <p>
                <strong>Legal basis:</strong> Equal Rights for Persons with Disabilities
                (Accessibility to Service) Regulations 5773-2013, Section 35, and Israeli
                Standard IS 5568 Level AA.
              </p>
              <p>Last updated: May 2025.</p>
            </>
          ),
        },
        {
          title: 'Accessibility Adaptations',
          body: (
            <>
              <p>The following adaptations have been implemented to improve accessibility:</p>
              <ul>
                <li>
                  <strong>Full keyboard navigation</strong> — Tab / Shift+Tab / Enter / Escape
                  to navigate all interactive elements.
                </li>
                <li>
                  <strong>Full RTL (Hebrew) layout support</strong> — the page direction is set
                  right-to-left across all screens.
                </li>
                <li>
                  <strong>Semantic HTML elements</strong> — use of <code>button</code>,{' '}
                  <code>form</code>, <code>label</code>, <code>ul</code>, <code>li</code>.
                </li>
                <li>
                  <strong>Associated form labels</strong> — every input field is linked to an
                  explicit <code>&lt;label&gt;</code> element.
                </li>
                <li>
                  <strong>Heebo variable font</strong> at 14–16px base size with a system font
                  fallback.
                </li>
                <li>
                  <strong>Text zoom up to 200%</strong> without loss of content or
                  functionality.
                </li>
                <li>
                  <strong>Basic WCAG AA colour contrast</strong> for primary text (blue
                  #1F7AFF on white).
                </li>
                <li>
                  <strong>Responsive design</strong> — the assessment is usable on mobile,
                  tablet, and desktop.
                </li>
              </ul>
            </>
          ),
        },
        {
          title: 'Standards & Testing',
          body: (
            <>
              <p>
                The interface aims to conform to Israeli Standard{' '}
                <strong>IS 5568 Level AA</strong>, equivalent to W3C WCAG 2.1 AA.
              </p>
              <p>
                Testing was performed using <strong>Lighthouse</strong> in Chrome. Formal
                screen-reader testing has not been conducted.
              </p>
            </>
          ),
        },
        {
          title: 'Known Limitations',
          highlight: true,
          body: (
            <>
              <p>
                The following accessibility limitations are known and have not yet been fully
                resolved:
              </p>
              <ul>
                <li>
                  <strong>(a) Radar / polar chart</strong> in the results view does not yet
                  have a text-based data table as an alternative —{' '}
                  <strong>remediation planned</strong>.
                </li>
                <li>
                  <strong>(b) Secondary muted text</strong> (light grey / slate-400) may not
                  fully meet WCAG AA contrast requirements at small sizes.
                </li>
                <li>
                  <strong>(c) Screen-reader audit</strong> — no comprehensive testing with
                  NVDA, JAWS, or VoiceOver has been completed.
                </li>
                <li>
                  <strong>(d) No audio or video content</strong> — captions and transcripts
                  are not applicable.
                </li>
              </ul>
            </>
          ),
        },
        {
          title: 'Contact & Feedback',
          body: (
            <>
              <p>
                To report an accessibility issue, request accessibility information, or ask
                for an accommodation, please contact us at:
              </p>
              <p>
                <strong>
                  <a href="mailto:tsur.david@gmail.com">tsur.david@gmail.com</a>
                </strong>
              </p>
              <p>
                We aim to respond within <strong>7 business days</strong>. Identified issues
                will be remediated within <strong>60 days</strong> per regulation.
              </p>
            </>
          ),
        },
      ]}
    />
  );
};

export default AccessibilityView;
