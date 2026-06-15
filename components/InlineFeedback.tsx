import React, { useState } from 'react';
import { Zap, Send, Gift, Sparkles } from 'lucide-react';
import { useFeedbackRepo } from '../services/ServiceContext';
import { Results } from '../types';
import { getPriorityCategory } from '../motivationCalculator';

interface InlineFeedbackProps {
  source: string;
  lang: 'en' | 'he';
  results?: Results | null;
  userId?: string;
  userEmail?: string;
  userName?: string;
}

const InlineFeedback: React.FC<InlineFeedbackProps> = ({
  source,
  lang,
  results,
  userId,
  userEmail,
  userName
}) => {
  const feedbackRepo = useFeedbackRepo();
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState<'idle' | 'commenting' | 'submitting' | 'rewarded'>('idle');

  const getRewardTip = () => {
    if (results) {
      const lowest = getPriorityCategory(results);
      if (lowest === 'autonomy') return lang === 'he' ? "טיפ בונוס: נסו להגדיר שעות 'ללא הפרעות' ביומן כדי להחזיר לעצמכם תחושת שליטה." : "Bonus Tip: Try blocking out 'do not disturb' hours in your calendar to regain a sense of control.";
      if (lowest === 'competence') return lang === 'he' ? "טיפ בונוס: בקשו משוב ספציפי על פרויקט אחד השבוע כדי לחזק את תחושת המסוגלות." : "Bonus Tip: Ask for specific feedback on one project this week to boost your sense of mastery.";
      if (lowest === 'relatedness') return lang === 'he' ? "טיפ בונוס: קבעו הפסקת קפה קצרה עם קולגה רק כדי לקשקש ולא על עבודה." : "Bonus Tip: Schedule a short coffee break with a colleague just to chat, no work talk.";
    }
    return lang === 'he' ? "טיפ בונוס: פצלו משימות גדולות לפרקי זמן של 25 דקות כדי לשמור על מיקוד ואנרגיה!" : "Bonus Tip: Break large tasks into 25-minute sprints to maintain focus and energy!";
  };

  const handleRate = (val: number) => {
    setRating(val);
    if (status === 'idle') setStatus('commenting');
  };

  const handleSubmit = async () => {
    if (rating === 0) return;
    setStatus('submitting');
    try {
      await feedbackRepo.saveFeedback({
        rating,
        comment,
        source,
        userId: userId || null,
        userEmail: userEmail || null,
        userName: userName || null,
        results: results || null,
        timestamp: null
      });
    } catch (error) {
      console.error('Failed to save feedback:', error);
    } finally {
      setStatus('rewarded');
    }
  };

  const isHe = lang === 'he';

  return (
    <div className={`mt-8 w-full p-6 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-[30px] border-2 border-dashed border-slate-200 shadow-sm relative overflow-hidden transition-all duration-500 text-${isHe ? 'right' : 'left'}`} dir={isHe ? 'rtl' : 'ltr'}>
      {status === 'rewarded' ? (
        <div className="animate-in zoom-in-95 fade-in duration-500 text-center py-2">
          <div className="mx-auto w-14 h-14 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mb-4 text-yellow-500 shadow-inner">
            <Gift size={28} className="animate-bounce" style={{ animationDuration: '2s' }} />
          </div>
          <h4 className="font-black text-xl text-slate-800 mb-4 tracking-tight">
            {isHe ? 'תודה על הפידבק!' : 'Thanks for your feedback!'}
          </h4>
          <div className="p-5 bg-white rounded-2xl shadow-sm border border-yellow-100/50 relative overflow-hidden text-center">
            <div className="absolute -top-2 -right-2 text-yellow-400/20"><Sparkles size={40} /></div>
            <p className="text-sm font-bold text-slate-700 leading-relaxed relative z-10">
              {getRewardTip()}
            </p>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <div className="flex-1">
              <h4 className="font-black text-lg text-slate-800 flex items-center gap-2">
                <Sparkles size={18} className="text-[#38BDF8]" />
                {isHe ? 'איך החוויה שלך עד כה?' : 'How is your experience so far?'}
              </h4>
              <p className="text-xs font-bold text-slate-400 mt-1">
                {isHe ? 'הפידבק שלך עוזר לנו להשתפר (ויש בונוס בסוף!)' : 'Your feedback helps us improve (and there\'s a bonus at the end!)'}
              </p>
            </div>
            
            <div className="flex gap-1 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  onClick={() => handleRate(val)}
                  className={`p-2 rounded-xl transition-all hover:scale-110 active:scale-95 ${rating >= val ? 'text-yellow-400 bg-yellow-50' : 'text-slate-200 hover:text-yellow-200'}`}
                  aria-label={`Rate ${val} stars`}
                >
                  <Zap size={24} className={rating >= val ? 'fill-current' : ''} />
                </button>
              ))}
            </div>
          </div>

          {status === 'commenting' && (
            <div className="animate-in slide-in-from-top-4 fade-in duration-300 pt-2 border-t border-slate-200/60 mt-4">
              <textarea
                className="w-full p-4 rounded-2xl bg-white border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/50 focus:border-transparent min-h-[80px] transition-all resize-none mb-3"
                placeholder={isHe ? 'ספר/י לנו עוד... (אופציונלי)' : 'Tell us more... (optional)'}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <div className="flex justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={status === 'submitting'}
                  className="px-6 py-3 text-white rounded-xl text-sm font-black flex items-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-50"
                  style={{ backgroundImage: 'var(--gradient-b2c)' }}
                >
                  {status === 'submitting' ? (
                    <span className="animate-pulse">{isHe ? 'שולח...' : 'Sending...'}</span>
                  ) : (
                    <>
                      {isHe ? 'שלח וגלה את הבונוס' : 'Submit & Unlock Bonus'} 
                      <Send size={16} className={isHe ? 'rotate-180' : ''} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InlineFeedback;
