import React, { useState, useEffect, useRef } from 'react';
import {
  X, Send, Sparkles, Bot, User, Hash, MessageSquare,
  Paperclip, Info, Zap, Smile, CheckCheck, Loader2, BrainCircuit, ListChecks,
  ShieldCheck
} from 'lucide-react';
import { ChatMessage, Conversation, Profile } from '../lib/types';
import { MOCK_MESSAGES, MOCK_PROFILES } from '../lib/constants';
import { suggestSmartReply, summarizeChat } from '../lib/gemini';
import { browserClient } from '@/lib/supabase/clients/browser.client';
import type { Database } from '@/types/supabase/core.types';

type RealProfile = Database['core']['Tables']['profiles']['Row'];

interface MessengerOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  context: 'marketplace' | 'support';
  conversation?: Conversation | null;
  currentUser: RealProfile | null;
}

const MessengerOverlay: React.FC<MessengerOverlayProps> = ({
  isOpen, onClose, context, conversation, currentUser
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [smartReplies, setSmartReplies] = useState<string[]>([]);
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [realMessages, setRealMessages] = useState<any[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);

  // Check if user is available
  const isUserAvailable = currentUser && currentUser.id;

  // Load or create conversation on mount
  useEffect(() => {
    if (isOpen && isUserAvailable) {
      loadOrCreateConversation();
    }
  }, [isOpen, isUserAvailable, context]);

  const loadOrCreateConversation = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const client = browserClient.getClient();

      let convId = conversation?.id;

      // If no conversation exists, create one
      if (!convId) {
        // Create new conversation
        const { data: newConversation, error: createError } = await client
          .from('conversations')
          .insert({
            subject: context === 'marketplace' ? 'Marketplace Inquiry' : 'Support Request',
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (createError) throw createError;

        convId = newConversation.id;
        setConversationId(convId);

        // Add participants
        await client
          .from('conversation_participants')
          .insert([
            { conversation_id: convId, profile_id: currentUser.id },
            { conversation_id: convId, profile_id: '00000000-0000-0000-0000-000000000000' } // Support bot/system user
          ]);
      } else {
        setConversationId(convId);
      }

      // Load messages
      const { data: messagesData, error: messagesError } = await client
        .from('chat_messages')
        .select('*, sender:profiles!sender_id(id, username, full_name, avatar_url)')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;

      // Transform to ChatMessage format
      const formattedMessages: ChatMessage[] = (messagesData || []).map(msg => ({
        id: msg.id,
        conversation_id: msg.conversation_id,
        sender_id: msg.sender_id,
        sender_name: msg.sender?.full_name || 'Unknown',
        text: msg.text,
        timestamp: msg.created_at,
        status: msg.status || 'sent'
      }));

      setRealMessages(formattedMessages);
    } catch (error) {
      console.error('Error loading conversation:', error);
      // Fallback to mock messages if needed
      setRealMessages(MOCK_MESSAGES);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !currentUser || !conversationId) return;

    const messageText = input;
    setInput('');

    // Optimistically add message
    const tempMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      conversation_id: conversationId,
      sender_id: currentUser.id,
      sender_name: currentUser.full_name || currentUser.username,
      text: messageText,
      timestamp: new Date().toISOString(),
      status: 'sending'
    };

    setRealMessages(prev => [...prev, tempMessage]);

    try {
      const client = browserClient.getClient();

      const { data: message, error } = await client
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          sender_id: currentUser.id,
          text: messageText,
          status: 'sent'
        })
        .select('*, sender:profiles!sender_id(id, username, full_name, avatar_url)')
        .single();

      if (error) throw error;

      // Replace temp message with real one
      const realMessage: ChatMessage = {
        id: message.id,
        conversation_id: message.conversation_id,
        sender_id: message.sender_id,
        sender_name: message.sender?.full_name || currentUser.full_name,
        text: message.text,
        timestamp: message.created_at,
        status: message.status || 'sent'
      };

      setRealMessages(prev => prev.map(msg =>
        msg.id === tempMessage.id ? realMessage : msg
      ));

      // Update conversation last message
      await client
        .from('conversations')
        .update({
          last_message: messageText,
          updated_at: new Date().toISOString()
        })
        .eq('id', conversationId);

      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
      // Update message status to error
      setRealMessages(prev => prev.map(msg =>
        msg.id === tempMessage.id ? { ...msg, status: 'error' } : msg
      ));
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [realMessages]);

  const loadSmartReplies = async (text: string) => {
    const replies = await suggestSmartReply(text, conversation?.subject || "General inquiry");
    setSmartReplies(replies);
  };

  const handleSend = (text: string = input) => {
    sendMessage();
  };

  const handleSummarize = async () => {
    if (realMessages.length === 0) return;
    setIsAiLoading(true);
    const result = await summarizeChat(realMessages);
    setSummary(result);
    setIsAiLoading(false);
  };

  if (!isOpen) return null;

  // Show loading state if user is not yet loaded
  if (!currentUser) {
    return (
      <div className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-white/80 backdrop-blur-3xl shadow-[-20px_0_60px_rgba(0,0,0,0.05)] z-[500] flex flex-col border-l border-white/40 animate-slide-in-right overflow-hidden">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
            <p className="text-slate-500 text-sm">Loading messenger...</p>
          </div>
        </div>
      </div>
    );
  }

  const displayMessages = realMessages.length > 0 ? realMessages : MOCK_MESSAGES;

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-white/80 backdrop-blur-3xl shadow-[-20px_0_60px_rgba(0,0,0,0.05)] z-[500] flex flex-col border-l border-white/40 animate-slide-in-right overflow-hidden">

      {/* Dynamic Header Sector */}
      <div className={`p-8 text-white flex items-center justify-between shadow-2xl relative overflow-hidden transition-colors duration-700 ${
        context === 'marketplace' ? 'bg-slate-950' : 'bg-[#0052FF]'
      }`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-2xl border border-white/20 shadow-xl group">
            {context === 'marketplace' ? <Zap size={28} className="group-hover:scale-110 transition-transform" /> : <Bot size={28} className="group-hover:scale-110 transition-transform" />}
          </div>
          <div>
            <h3 className="font-black text-xl tracking-tight uppercase">
              {context === 'marketplace' ? 'Trade Hub' : 'Support Link'}
            </h3>
            <div className="flex items-center gap-2 mt-1">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               <p className="text-[10px] font-black uppercase opacity-60 tracking-[0.2em]">
                 {conversation?.subject || 'Neural Comms Active'}
               </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 relative z-10">
           <button onClick={handleSummarize} className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all" title="Run Neural Summary">
             <ListChecks size={22} />
           </button>
           <button onClick={onClose} className="p-3 bg-white/10 hover:bg-rose-500/20 rounded-xl transition-all"><X size={22} /></button>
        </div>
      </div>

      {/* Neural Insight Panel */}
      {summary && (
        <div className="p-6 bg-blue-50/50 border-b border-blue-100 animate-fade-in relative mx-4 mt-4 rounded-3xl overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/5 to-transparent"></div>
           <div className="flex items-start gap-4 relative z-10">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl shrink-0">
                <BrainCircuit size={20} />
              </div>
              <div className="text-sm text-blue-900 leading-relaxed">
                 <p className="font-black uppercase text-[10px] mb-2 tracking-widest opacity-60">Intelligence Sync Summary</p>
                 <p className="font-medium italic">{summary}</p>
              </div>
           </div>
           <button onClick={() => setSummary(null)} className="absolute top-4 right-4 text-blue-300 hover:text-blue-600"><X size={16}/></button>
        </div>
      )}

      {/* Messaging Grid */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar bg-slate-50/30">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="animate-spin text-blue-600" size={32} />
          </div>
        ) : displayMessages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.sender_id === currentUser.id ? 'items-end' : 'items-start'} animate-fade-in`}>
            <div className={`max-w-[85%] p-5 rounded-[2rem] shadow-sm relative group transition-all duration-300 ${
              msg.sender_id === currentUser.id
                ? 'bg-[#0052FF] text-white rounded-tr-none shadow-blue-500/10'
                : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none hover:shadow-xl'
            }`}>
              <p className="text-[13px] leading-relaxed font-medium">{msg.text}</p>
              <div className={`text-[9px] mt-3 font-black uppercase tracking-widest flex items-center gap-2 opacity-50 ${
                msg.sender_id === currentUser.id ? 'text-blue-100' : 'text-slate-400'
              }`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {msg.sender_id === currentUser.id && msg.status === 'error' && (
                  <span className="text-red-400">Failed</span>
                )}
                {msg.sender_id === currentUser.id && msg.status === 'sent' && <CheckCheck size={14} strokeWidth={3} />}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2 px-1">
               <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{msg.sender_name}</p>
               {msg.sender_id !== currentUser.id && <span className="w-1 h-1 bg-slate-300 rounded-full"></span>}
               {msg.sender_id !== currentUser.id && <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Verified Node</span>}
            </div>
          </div>
        ))}
        {isAiLoading && (
          <div className="flex items-center gap-4 text-[#0052FF] animate-pulse">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
               <Loader2 className="animate-spin" size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Decoding conversation matrix...</span>
          </div>
        )}
      </div>

      {/* Interaction Sector */}
      <div className="p-8 bg-white/60 backdrop-blur-2xl border-t border-white shadow-[0_-20px_60px_rgba(0,0,0,0.03)] space-y-6">

        {smartReplies.length > 0 && (
          <div className="flex flex-wrap gap-2 animate-fade-in px-2">
            {smartReplies.map((reply, i) => (
              <button
                key={i}
                onClick={() => handleSend(reply)}
                className="px-5 py-2.5 bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-[#0052FF] hover:text-white hover:border-[#0052FF] hover:shadow-xl transition-all active:scale-90"
              >
                {reply}
              </button>
            ))}
          </div>
        )}

        <div className="relative group/input">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            placeholder="Type message or sync protocols..."
            className="w-full p-6 bg-slate-100/50 border border-slate-200/50 rounded-[2.5rem] font-bold text-sm outline-none focus:ring-[15px] focus:ring-[#0052FF]/[0.03] focus:bg-white focus:border-blue-500/20 transition-all duration-500 h-28 resize-none shadow-inner"
          />
          <div className="absolute bottom-6 right-6 flex items-center gap-3">
             <button className="p-3 text-slate-300 hover:text-[#0052FF] transition-all hover:bg-slate-50 rounded-full"><Paperclip size={20}/></button>
             <button
               onClick={() => handleSend()}
               disabled={!input.trim()}
               className="p-4 bg-slate-950 text-white rounded-full hover:bg-[#0052FF] transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed shadow-2xl shadow-slate-900/20 active:scale-90"
             >
               <Send size={22} strokeWidth={2.5} />
             </button>
          </div>
        </div>

        <div className="flex items-center justify-between px-4">
           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
             <ShieldCheck size={12} className="text-emerald-500" /> End-to-End Neural Link
           </p>
           <button className="text-[9px] font-black text-slate-400 hover:text-blue-500 uppercase tracking-widest transition-colors flex items-center gap-1">
             Sync Options <Info size={10} />
           </button>
        </div>
      </div>
    </div>
  );
};

export default MessengerOverlay;