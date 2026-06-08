import React, { useState } from 'react';
import { MessageSquarePlus } from 'lucide-react';
import FeedbackModal from './FeedbackModal';

interface FloatingFeedbackBtnProps {
  userId?: string | null;
  userEmail?: string | null;
  userName?: string | null;
  source: string;
}

const FloatingFeedbackBtn: React.FC<FloatingFeedbackBtnProps> = ({ userId, userEmail, userName, source }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 px-5 py-3 bg-slate-900 text-white rounded-full shadow-xl hover:-translate-y-1 hover:shadow-2xl active:scale-95 transition-all duration-200 group flex items-center justify-center gap-2 font-bold text-sm"
        aria-label="Send Feedback"
      >
        <MessageSquarePlus size={20} className="group-hover:scale-110 transition-transform" />
        Feedback
      </button>

      <FeedbackModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        userId={userId}
        userEmail={userEmail}
        userName={userName}
        source={source}
      />
    </>
  );
};

export default FloatingFeedbackBtn;
