import React, { useState, useEffect } from 'react';
import { 
  FaHistory, FaChevronRight, FaChevronDown, FaClock, 
  FaCheckCircle, FaExclamationCircle, FaUser, FaHeadset,
  FaArrowLeft, FaPaperPlane
} from 'react-icons/fa';
import { useColors } from '../../../hooks/useColors';
import { FONTS } from '../../../constants/theme';
import { API_URL } from '../../../utils/constants';
import { motion, AnimatePresence } from 'framer-motion';

const SupportHistory = ({ onBack }) => {
  const COLORS = useColors();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem("account_id");
      const authKey = localStorage.getItem("auth_secret_key");
      
      if (!userId || !authKey) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}?USER_ID=${userId}`, {
        method: "GET",
        headers: {
          Route: "route-get-user-tickets",
          AuthToken: authKey
        }
      });
      
      const result = await response.json();
      if (result.status_code === "success") {
        setTickets(result.data);
      }
    } catch (err) {
      console.error("Fetch history error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'open': return '#f59e0b';
      case 'in_progress': return '#3b82f6';
      case 'closed': return '#10b981';
      default: return '#6b7280';
    }
  };

  const TicketCard = ({ ticket }) => (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => setSelectedTicket(ticket)}
      className="bg-white/5 border border-white/5 rounded-2xl p-4 cursor-pointer hover:bg-white/10 transition-all group"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center text-brand" style={{ backgroundColor: `${COLORS.brand}15`, color: COLORS.brand }}>
            <FaHistory />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-tight truncate max-w-[150px]">
              {ticket.subject}
            </h4>
            <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">
              ID: {ticket.ticket_id}
            </span>
          </div>
        </div>
        <div className="px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest"
          style={{ backgroundColor: `${getStatusColor(ticket.status)}20`, color: getStatusColor(ticket.status), border: `1px solid ${getStatusColor(ticket.status)}30` }}>
          {ticket.status.replace('_', ' ')}
        </div>
      </div>
      
      <div className="flex justify-between items-center text-[10px] text-white/40">
        <div className="flex items-center gap-1">
          <FaClock size={10} />
          <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-1 text-brand" style={{ color: COLORS.brand }}>
          <span>View Thread</span>
          <FaChevronRight size={10} />
        </div>
      </div>
    </motion.div>
  );

  const ConversationThread = ({ ticket }) => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-6"
    >
      <button 
        onClick={() => setSelectedTicket(null)}
        className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-brand transition-colors mb-4"
      >
        <FaArrowLeft /> Back to List
      </button>

      <div className="bg-brand/5 border border-brand/10 rounded-2xl p-5 mb-6">
        <h3 className="text-lg font-black uppercase tracking-tighter text-white mb-1" style={{ fontFamily: FONTS.head }}>
          {ticket.subject}
        </h3>
        <p className="text-xs text-white/60 leading-relaxed">
          {ticket.message}
        </p>
      </div>

      <div className="space-y-4">
        {ticket.replies.map((reply, i) => (
          <div key={i} className={`flex flex-col ${reply.sender_type === 'admin' ? 'items-start' : 'items-end'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-xs font-medium leading-relaxed ${
              reply.sender_type === 'admin' 
              ? 'bg-blue-500/10 border border-blue-500/20 text-blue-100 rounded-bl-none' 
              : 'bg-white/5 border border-white/5 text-white/80 rounded-br-none'
            }`}>
              <div className="flex items-center gap-2 mb-2 opacity-50 text-[8px] font-black uppercase tracking-widest">
                {reply.sender_type === 'admin' ? <><FaHeadset /> Support Team</> : <><FaUser /> You</>}
                <span>•</span>
                <span>{new Date(reply.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              {reply.message}
            </div>
          </div>
        ))}
      </div>

      {ticket.status !== 'closed' && (
        <div className="pt-6 border-t border-white/5">
           <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] text-center italic">
             Reply from dashboard is coming soon. Please contact us via live chat for immediate assistance.
           </p>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="w-[96%] max-w-3xl mx-auto overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 shadow-2xl relative mb-6 p-6"
      style={{ backgroundColor: COLORS.bg2 }}>
      
      <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg text-black text-lg"
            style={{ background: COLORS.brandGradient }}>
            <FaHistory />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white" style={{ fontFamily: FONTS.head }}>
              Ticket <span style={{ color: COLORS.brand }}>History</span>
            </h2>
            <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">Your past conversations</span>
          </div>
        </div>
        <button 
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-bold uppercase tracking-widest text-white/60 hover:bg-brand hover:text-black transition-all"
        >
          New Ticket
        </button>
      </div>

      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[400px] gap-4">
             <div className="w-8 h-8 border-2 border-brand/30 border-t-brand rounded-full animate-spin"></div>
             <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">Syncing History...</p>
          </div>
        ) : selectedTicket ? (
          <AnimatePresence mode="wait">
            <ConversationThread ticket={selectedTicket} />
          </AnimatePresence>
        ) : tickets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tickets.map((ticket, i) => (
              <TicketCard key={i} ticket={ticket} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[400px] text-center px-10">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-white/10 text-3xl mb-6">
              <FaHistory />
            </div>
            <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-2">No Records Found</h3>
            <p className="text-[10px] text-white/20 uppercase tracking-tight">You haven't submitted any support tickets yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportHistory;
