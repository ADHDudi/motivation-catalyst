import React, { useState } from 'react';
import { X, MessageCircle, Zap, CheckCircle2 } from 'lucide-react';
import { saveUserFeedback } from '../firestoreUtils';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string | null;
  userEmail?: string | null;
  userName?: string | null;
  source: string;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, userId, userEmail, userName, source }) => {
  const [text, setText] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setIsSubmitting(true);
    setError(null);

    try {
      await saveUserFeedback({
        userId,
        userEmail,
        userName,
        feedbackText: text,
        rating: rating || undefined,
        source,
        sessionId: null
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setText('');
        setRating(null);
        onClose();
      }, 2000);
    } catch (err) {
      console.error(err);
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setText('');
    setRating(null);
    setError(null);
    onClose();
  };

  // Convert source to a readable format if needed, but the screenshot just says "Main Page"
  // Let's just use the `source` prop, or default to it.
  const displaySource = source.replace('Step: ', '').replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in" dir="ltr">
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 relative text-left">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h3 className="font-black text-[22px] text-slate-800 flex items-center gap-3">
            <MessageCircle size={28} className="text-[#584cf4]" /> Help Us Improve FounderFit
          </h3>
          <button onClick={handleClose} className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6">
          {success ? (
            <div className="py-12 text-center animate-in fade-in zoom-in">
              <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={36} />
              </div>
              <h4 className="font-black text-2xl text-slate-800 mb-2">Thank You!</h4>
              <p className="text-slate-500 font-medium">Your feedback has been submitted successfully.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">
                  {error}
                </div>
              )}

              {/* Context Box */}
              <div className="flex justify-between items-center bg-slate-50 rounded-xl p-4 border border-slate-100">
                <span className="text-slate-400 font-bold text-sm">Feedback Context:</span>
                <span className="text-slate-700 font-black text-sm">{displaySource}</span>
              </div>

              {/* Rating Section */}
              <div className="text-center pt-2">
                <h4 className="text-slate-500 font-black tracking-widest text-sm uppercase mb-6">
                  How would you rate this screen / analysis?
                </h4>
                <div className="flex justify-center gap-4">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = (hoverRating !== null ? hoverRating : rating) || 0;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="transition-transform hover:scale-110 active:scale-95 focus:outline-none"
                      >
                        <Zap 
                          size={40} 
                          strokeWidth={active >= star ? 0 : 2}
                          className={`transition-colors ${active >= star ? 'fill-[#f5a623] text-[#f5a623]' : 'text-slate-200'}`} 
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Textarea */}
              <textarea
                className="w-full p-5 min-h-[160px] bg-white border-2 border-slate-100 rounded-2xl focus:outline-none focus:ring-0 focus:border-[#584cf4] transition-colors resize-none text-slate-700 font-medium placeholder:text-slate-400"
                placeholder="Tell us what you like, what is confusing, or what we can improve..."
                value={text}
                onChange={e => setText(e.target.value)}
                required
              />

              {/* Footer Buttons */}
              <div className="flex justify-end gap-4 mt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-[14px] transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !text.trim()}
                  className="px-8 py-3 bg-[#584cf4] hover:bg-[#4a3dec] text-white font-bold rounded-[14px] transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
