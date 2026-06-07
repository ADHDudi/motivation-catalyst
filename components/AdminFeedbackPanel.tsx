import React, { useEffect, useState } from 'react';
import { X, RefreshCcw, CheckCircle2, Circle } from 'lucide-react';
import { listFeedbacks, updateFeedbackRead } from '../firestoreUtils';
import { UserFeedback } from '../types';

interface AdminFeedbackPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminFeedbackPanel: React.FC<AdminFeedbackPanelProps> = ({ isOpen, onClose }) => {
  const [feedbacks, setFeedbacks] = useState<UserFeedback[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedbacks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await listFeedbacks();
      setFeedbacks(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch feedbacks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchFeedbacks();
    }
  }, [isOpen]);

  const handleToggleRead = async (id: string, currentRead: boolean) => {
    try {
      await updateFeedbackRead(id, !currentRead);
      setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, read: !currentRead } : f));
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  if (!isOpen) return null;

  const total = feedbacks.length;
  const readCount = feedbacks.filter(f => f.read).length;
  const unreadCount = total - readCount;

  return (
    <div className="fixed inset-0 z-[200] flex justify-end bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-50 w-full max-w-2xl h-full shadow-2xl flex flex-col animate-in slide-in-from-right text-left" dir="ltr">
        
        <div className="bg-white px-6 py-5 border-b border-slate-200 flex justify-between items-center shrink-0">
          <div>
            <h2 className="font-black text-2xl text-slate-800">Feedback Management</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Total: {total} &middot; Unread: <span className="text-[#1F7AFF] font-bold">{unreadCount}</span> &middot; Read: {readCount}
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={fetchFeedbacks} className="p-2 text-slate-400 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all" aria-label="Refresh">
              <RefreshCcw size={20} className={isLoading ? 'animate-spin' : ''} />
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all" aria-label="Close">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 font-bold">{error}</div>
          )}
          
          {isLoading && feedbacks.length === 0 && (
            <div className="text-center py-20 text-slate-400 font-medium">Loading feedback...</div>
          )}

          {!isLoading && feedbacks.length === 0 && !error && (
            <div className="text-center py-20 text-slate-400 font-medium">No feedback received yet.</div>
          )}

          {feedbacks.map(f => (
            <div key={f.id} className={`bg-white p-5 rounded-3xl border transition-all ${f.read ? 'border-slate-100 opacity-60' : 'border-[#38BDF8]/30 shadow-md'}`}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-black text-slate-800">{f.userName || 'Anonymous'}</div>
                  <div className="text-xs text-slate-500 font-bold">{f.userEmail || 'No email provided'}</div>
                </div>
                <button 
                  onClick={() => handleToggleRead(f.id, f.read)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${f.read ? 'bg-slate-100 text-slate-500 hover:bg-slate-200' : 'bg-[#1F7AFF]/10 text-[#1F7AFF] hover:bg-[#1F7AFF]/20'}`}
                >
                  {f.read ? <><CheckCircle2 size={14} /> Read</> : <><Circle size={14} /> Mark Read</>}
                </button>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl whitespace-pre-wrap font-medium">
                {f.feedbackText}
              </p>
              <div className="flex justify-between items-center mt-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Source: {f.source}</span>
                <span>{f.createdAt?.toDate ? f.createdAt.toDate().toLocaleString() : 'Just now'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminFeedbackPanel;
