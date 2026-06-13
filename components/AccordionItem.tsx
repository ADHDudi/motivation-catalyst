import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  defaultOpen?: boolean;
  icon?: React.ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, children, style, defaultOpen = false, icon }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-slate-100 rounded-2xl overflow-hidden mb-3" style={style}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between p-4 transition-colors hover:bg-white/10 text-right focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--b2c-azure)] rounded-2xl"
      >
        <span className="font-bold text-sm leading-tight flex items-center gap-2">
          {icon && <span className="shrink-0" aria-hidden="true">{icon}</span>}
          {title}
        </span>
        {isOpen
          ? <ChevronUp size={18} className="text-slate-600 shrink-0" />
          : <ChevronDown size={18} className="text-slate-600 shrink-0" />}
      </button>
      {isOpen && <div className="p-4 pt-0 text-sm leading-relaxed border-t border-transparent animate-in slide-in-from-top-1">{children}</div>}
    </div>
  );
};

export default AccordionItem;
