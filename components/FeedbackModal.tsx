import React, { useState } from 'react';
import { X, MessageSquare, Send } from 'lucide-react';
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
        source,
        sessionId: null
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setText('');
        onClose();
      }, 2000);
    } catch (err) {
      console.error(err);
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 relative text-left" dir="auto">
        <div className="flex justify-between items-center p-5 border-b border-slate-100">
          <h3 className="font-black text-lg text-slate-800 flex items-center gap-2">
            <MessageSquare size={20} className="text-[#38BDF8]" /> Share Feedback
          </h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-5">
          {success ? (
            <div className="py-8 text-center animate-in fade-in zoom-in">
              <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send size={24} />
              </div>
              <h4 className="font-black text-xl text-slate-800 mb-2">Thank You!</h4>
              <p className="text-slate-500 font-medium">Your feedback has been received.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">
                  {error}
                </div>
              )}
              <textarea
                className="w-full p-4 min-h-[120px] bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#38BDF8] focus:border-transparent transition-all resize-none text-slate-700 font-medium placeholder:text-slate-400"
                placeholder="What's on your mind? Found a bug? Have a suggestion?"
                value={text}
                onChange={e => setText(e.target.value)}
                required
              />
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !text.trim()}
                  className="px-6 py-3 bg-[#1F7AFF] hover:bg-[#324FA2] text-white font-bold rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? 'Sending...' : 'Send Feedback'} <Send size={16} />
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
