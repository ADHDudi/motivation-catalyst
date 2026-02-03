import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  defaultOpen?: boolean;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, children, style, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-slate-100 rounded-2xl overflow-hidden mb-3" style={style}>
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-4 transition-colors hover:bg-white/10 text-right">
        <span className="font-bold text-sm leading-tight">{title}</span>
        {isOpen ? <ChevronUp size={16} className="opacity-50" /> : <ChevronDown size={16} className="opacity-50" />}
      </button>
      {isOpen && <div className="p-4 pt-0 text-sm leading-relaxed border-t border-transparent animate-in slide-in-from-top-1">{children}</div>}
    </div>
  );
};

export default AccordionItem;