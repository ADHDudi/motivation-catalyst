import React, { useEffect, useState } from 'react';
import { X, ClipboardList, Clock, Zap } from 'lucide-react';
import { listFeedbacks, updateFeedbackRead } from '../firestoreUtils';
import { UserFeedback } from '../types';

interface AdminFeedbackPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'all' | 'unread' | 'read';

const AdminFeedbackPanel: React.FC<AdminFeedbackPanelProps> = ({ isOpen, onClose }) => {
  const [feedbacks, setFeedbacks] = useState<UserFeedback[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('all');

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

  const totalCount = feedbacks.length;
  const readCount = feedbacks.filter(f => f.read).length;
  const unreadCount = totalCount - readCount;

  const filteredFeedbacks = feedbacks.filter(f => {
    if (activeTab === 'unread') return !f.read;
    if (activeTab === 'read') return f.read;
    return true;
  });

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/50 backdrop-blur-sm animate-in fade-in text-left" dir="ltr">
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col animate-in zoom-in-95">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 shrink-0">
          <h2 className="font-black text-[22px] text-slate-800 flex items-center gap-3">
            <ClipboardList size={28} className="text-[#584cf4]" /> User Feedback Management
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 py-4 border-b border-slate-100 shrink-0 flex gap-4">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'all' ? 'bg-[#584cf4] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            All ({totalCount})
          </button>
          <button
            onClick={() => setActiveTab('unread')}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'unread' ? 'bg-[#584cf4] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setActiveTab('read')}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'read' ? 'bg-[#584cf4] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Read ({readCount})
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 font-bold">{error}</div>
          )}
          
          {isLoading && feedbacks.length === 0 && (
            <div className="text-center py-20 text-slate-400 font-medium">Loading feedback...</div>
          )}

          {!isLoading && filteredFeedbacks.length === 0 && !error && (
            <div className="text-center py-20 text-slate-400 font-medium">No feedback found.</div>
          )}

          {filteredFeedbacks.map(f => {
            const displaySource = f.source.replace('Step: ', '').toUpperCase();
            return (
              <div key={f.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-black text-slate-800 text-lg">{f.userName || 'Anonymous'}</span>
                      <span className="text-sm text-slate-400 font-medium">({f.userEmail || 'No email provided'})</span>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                        <Clock size={14} />
                        {f.createdAt?.toDate ? f.createdAt.toDate().toLocaleString() : 'Just now'}
                      </div>
                      <div className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-wider rounded-md">
                        {displaySource}
                      </div>
                      {f.sessionId && (
                        <span className="text-slate-400 font-medium text-xs">({f.sessionId})</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    {/* Rating display */}
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Zap 
                          key={star}
                          size={16} 
                          strokeWidth={f.rating && f.rating >= star ? 0 : 2}
                          className={f.rating && f.rating >= star ? 'fill-[#f5a623] text-[#f5a623]' : 'text-slate-200'} 
                        />
                      ))}
                    </div>

                    <button 
                      onClick={() => handleToggleRead(f.id, f.read)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                        f.read 
                          ? 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50' 
                          : 'bg-[#584cf4]/10 border-transparent text-[#584cf4] hover:bg-[#584cf4]/20'
                      }`}
                    >
                      {f.read ? 'Mark Unread' : 'Mark Read'}
                    </button>
                  </div>
                </div>
                
                <p className="text-sm text-slate-700 leading-relaxed font-medium mt-4 whitespace-pre-wrap" dir="auto">
                  {f.feedbackText}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminFeedbackPanel;
