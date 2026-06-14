import React, { useState } from 'react';
import { MessageCircle, ChevronUp } from 'lucide-react';
import { TranslationData, Results } from '../types';
import { isLow, getPriorityCategory } from '../motivationCalculator';

interface ConversationStarterProps {
  role: 'employee' | 'manager';
  scores: Results | null;
  t: TranslationData;
}

const ConversationStarter: React.FC<ConversationStarterProps> = ({ role, scores, t }) => {
  const [isOpen, setIsOpen] = useState(false);
  if (!scores) return null;

  const lowestCategory = getPriorityCategory(scores);
  const category: 'autonomy' | 'competence' | 'relatedness' | 'high' =
    isLow(scores[lowestCategory]) ? lowestCategory : 'high';
  // @ts-ignore - dynamic key access
  const tip = t.conversationTips[role][category];

  return (
    <div className="mt-4">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-full py-4 bg-white border border-[#324FA2]/20 text-[#324FA2] rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#324FA2]/5 transition-all shadow-sm active:scale-98"
        >
          <MessageCircle className="w-5 h-5 text-[#324FA2]" />
          {t.genConversation}
        </button>
      ) : (
        <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 p-4 rounded-xl animate-in zoom-in-95">
          <div className="flex justify-between items-start mb-2">
            <h5 className="font-bold text-[#324FA2] text-sm flex items-center gap-2">
              <MessageCircle className="w-4 h-4" /> {t.conversationTitle}
            </h5>
            <button onClick={() => setIsOpen(false)} className="p-1 -mr-1 text-slate-400 hover:text-slate-600">
              <ChevronUp className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-indigo-700 mb-3 font-medium opacity-80">{t.conversationIntro}</p>
          <div className="bg-white p-4 rounded-lg border border-indigo-50 text-indigo-900 text-sm italic shadow-sm relative leading-relaxed">
            <span className="absolute top-2 right-2 text-indigo-100 text-4xl leading-none font-serif opacity-50">"</span>
            {tip}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationStarter;