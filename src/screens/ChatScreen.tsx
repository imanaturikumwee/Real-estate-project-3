import React, { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store/index.ts';
import {
  setActiveConversationId,
  addMessage,
  setAgentTyping,
  setSearchFilter,
} from '../store/chatSlice.ts';
import { setBookingModalOpen, setToastMessage } from '../store/uiSlice.ts';
import { Message } from '../types/index.ts';
import { getSocket } from '../lib/socket.ts';

export const ChatScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { conversations, activeConversationId, messages, isAgentTyping, searchFilter } =
    useAppSelector((state) => state.chat);
  const { user } = useAppSelector((state) => state.auth);
  const { items: properties } = useAppSelector((state) => state.properties);

  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv =
    conversations.find((c) => c.id === activeConversationId) || conversations[0];
  const currentMessages = messages[activeConv?.id || ''] || [];

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages, isAgentTyping]);

  // Connect socket listener for incoming agent responses
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleIncomingMessage = (msg: Message) => {
      if (msg.conversationId === activeConv?.id) {
        dispatch(addMessage(msg));
        dispatch(setAgentTyping(false));
      }
    };

    const handleTypingStatus = (data: { conversationId: string; isTyping: boolean }) => {
      if (data.conversationId === activeConv?.id) {
        dispatch(setAgentTyping(data.isTyping));
      }
    };

    socket.on('chat:message', handleIncomingMessage);
    socket.on('chat:typing', handleTypingStatus);

    return () => {
      socket.off('chat:message', handleIncomingMessage);
      socket.off('chat:typing', handleTypingStatus);
    };
  }, [activeConv?.id, dispatch]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text || !activeConv) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      conversationId: activeConv.id,
      senderId: user?.id || 'usr_default_1',
      senderName: user?.fullName || 'Client',
      senderAvatar:
        user?.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      senderRole: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    dispatch(addMessage(newMsg));
    setInputVal('');

    // Emit via socket
    const socket = getSocket();
    if (socket && socket.connected) {
      socket.emit('chat:send', newMsg);
    }

    // Auto-respond simulation with intelligent agent reply
    dispatch(setAgentTyping(true));
    setTimeout(() => {
      let agentReplyText = '';
      let insightCard = undefined;

      const lower = text.toLowerCase();
      if (lower.includes('viewing') || lower.includes('schedule') || lower.includes('saturday')) {
        agentReplyText = `Certainly! I've reserved a tentative private viewing for this Saturday at 11:00 AM at ${activeConv.propertyTitle}. Our chauffeur can also pick you up from the Kigali Marriott or your residence. Shall I confirm the slot?`;
      } else if (lower.includes('yield') || lower.includes('score') || lower.includes('growth')) {
        agentReplyText = `Here is our updated AI intelligence dossier for ${activeConv.propertyTitle}: In Nyarutarama, sovereign diplomatic lease renewals average $4,200/month. The historical 5-year capital appreciation trend sits comfortably at +12.4% net.`;
        insightCard = {
          propertyName: activeConv.propertyTitle,
          score: 95,
          growthPotential: '+13.1% /yr projected',
          riskLevel: 'Minimal Sovereign Risk',
          quote: 'Diplomatic quarter tenancy ensures multi-year USD denominated lease commitments.',
          price: activeConv.propertyPrice,
        };
      } else if (lower.includes('title') || lower.includes('rdb') || lower.includes('deed')) {
        agentReplyText = `All our properties undergo rigorous due diligence with the Rwanda Land Management and Information System (RLMIS). The digital title deed for ${activeConv.propertyTitle} is clean, fully verified, and ready for swift notarized conveyance.`;
      } else {
        agentReplyText = `Thank you for reaching out! Regarding ${activeConv.propertyTitle}, this is currently one of our highest-inquiry assets due to its prime architectural craftsmanship. How may I best assist you with legal verification, site visits, or yield calculations?`;
      }

      const agentMsg: Message = {
        id: `msg-agent-${Date.now()}`,
        conversationId: activeConv.id,
        senderId: 'agent_dany',
        senderName: activeConv.agentName,
        senderAvatar: activeConv.agentAvatar,
        senderRole: 'agent',
        text: agentReplyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        aiInsightCard: insightCard,
      };

      dispatch(addMessage(agentMsg));
      dispatch(setAgentTyping(false));
    }, 1200);
  };

  const filteredConversations = conversations.filter((c) => {
    if (!searchFilter) return true;
    const q = searchFilter.toLowerCase();
    return (
      c.agentName.toLowerCase().includes(q) ||
      c.propertyTitle.toLowerCase().includes(q) ||
      c.lastMessage.toLowerCase().includes(q)
    );
  });

  const matchedProperty = properties.find(
    (p) => p.title.toLowerCase() === activeConv?.propertyTitle.toLowerCase()
  );

  return (
    <div className="min-h-[calc(100vh-65px)] bg-slate-100 dark:bg-slate-950 flex flex-col md:flex-row transition-colors">
      {/* Sidebar / Conversation List */}
      <aside className="w-full md:w-80 lg:w-96 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-black font-headline text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-900 dark:text-blue-400">
                chat
              </span>
              Concierge Inquiries
            </h2>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-900 dark:text-blue-300">
              Live Sync
            </span>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchFilter}
              onChange={(e) => dispatch(setSearchFilter(e.target.value))}
              className="w-full px-3 py-2 pl-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-900 border border-slate-200 dark:border-slate-700"
            />
            <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-xs text-slate-400">
              search
            </span>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
          {filteredConversations.map((conv) => {
            const isSelected = conv.id === activeConv?.id;
            return (
              <div
                key={conv.id}
                onClick={() => dispatch(setActiveConversationId(conv.id))}
                className={`p-4 cursor-pointer transition flex items-start gap-3 ${
                  isSelected
                    ? 'bg-blue-50/70 dark:bg-blue-950/40 border-l-4 border-blue-900 dark:border-blue-500'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                {/* Agent Avatar with Status */}
                <div className="relative shrink-0">
                  <img
                    src={conv.agentAvatar}
                    alt={conv.agentName}
                    className="w-11 h-11 rounded-2xl object-cover ring-2 ring-slate-200 dark:ring-slate-700"
                  />
                  {conv.agentStatus === 'ONLINE' && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate font-headline">
                      {conv.agentName}
                    </h3>
                    <span className="text-[10px] text-slate-400">{conv.lastMessageTime}</span>
                  </div>

                  <p className="text-[11px] font-semibold text-blue-900 dark:text-blue-400 truncate mb-1">
                    {conv.propertyTitle} • {conv.propertyPrice}
                  </p>

                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {conv.lastMessage}
                  </p>

                  {conv.scheduledViewingBadge && (
                    <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold text-blue-900 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/60 px-2 py-0.5 rounded-md">
                      <span className="material-symbols-outlined text-[10px]">event</span>
                      {conv.scheduledViewingBadge}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Main Chat Feed */}
      <main className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden">
        {/* Header Bar */}
        <header className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={activeConv?.agentAvatar}
                alt={activeConv?.agentName}
                className="w-10 h-10 rounded-2xl object-cover ring-1 ring-slate-300 dark:ring-slate-700"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black font-headline text-slate-900 dark:text-white">
                  {activeConv?.agentName}
                </h3>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  ONLINE
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{activeConv?.agentRole}</p>
            </div>
          </div>

          {/* Associated Property Capsule & Quick CTA */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 pr-3 rounded-2xl border border-slate-200 dark:border-slate-700">
              <img
                src={activeConv?.propertyImage}
                alt={activeConv?.propertyTitle}
                className="w-8 h-8 rounded-xl object-cover"
              />
              <div className="text-left">
                <span className="text-[11px] font-bold text-slate-900 dark:text-white block leading-tight">
                  {activeConv?.propertyTitle}
                </span>
                <span className="text-[10px] font-semibold text-blue-900 dark:text-blue-400 block leading-tight">
                  {activeConv?.propertyPrice}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                if (matchedProperty) {
                  dispatch(setBookingModalOpen({ open: true, property: matchedProperty }));
                } else {
                  dispatch(setToastMessage(`Viewing scheduled for ${activeConv.propertyTitle}`));
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-xs">calendar_month</span>
              Book Viewing
            </button>
          </div>
        </header>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          <div className="text-center my-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-200/60 dark:bg-slate-800/80 px-3 py-1 rounded-full">
              Encrypted Real-Time Concierge Channel
            </span>
          </div>

          {currentMessages.map((msg) => {
            const isMe = msg.senderRole === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                {!isMe && (
                  <img
                    src={msg.senderAvatar}
                    alt={msg.senderName}
                    className="w-8 h-8 rounded-xl object-cover shrink-0 ring-1 ring-slate-300 dark:ring-slate-700"
                  />
                )}

                <div className={`max-w-lg space-y-2 ${isMe ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                      isMe
                        ? 'bg-blue-900 text-white rounded-br-none'
                        : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none border border-slate-200/80 dark:border-slate-700/80'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span
                      className={`text-[9px] block text-right mt-1.5 font-medium ${
                        isMe ? 'text-blue-200' : 'text-slate-400'
                      }`}
                    >
                      {msg.time}
                    </span>
                  </div>

                  {/* Embedded AI Property Insight Card */}
                  {msg.aiInsightCard && (
                    <div className="p-4 bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-2xl shadow-xl border border-blue-800/80 space-y-3 max-w-md animate-fade-in">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-blue-300 text-sm">
                            psychology
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-wider text-blue-200">
                            AI Property Score Card
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/30 text-blue-200">
                          Verified Model
                        </span>
                      </div>

                      <div className="flex justify-between items-baseline">
                        <div>
                          <h4 className="text-base font-black font-headline">
                            {msg.aiInsightCard.propertyName}
                          </h4>
                          <span className="text-xs text-blue-200 font-bold">
                            {msg.aiInsightCard.price}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-black font-headline text-emerald-300">
                            {msg.aiInsightCard.score}
                          </span>
                          <span className="text-[10px] text-blue-200 block font-bold">/ 100</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-white/10">
                        <div className="bg-white/10 p-2 rounded-xl">
                          <span className="text-[9px] uppercase tracking-wider text-blue-200 font-bold block">
                            Growth Potential
                          </span>
                          <span className="font-bold text-emerald-300">
                            {msg.aiInsightCard.growthPotential}
                          </span>
                        </div>
                        <div className="bg-white/10 p-2 rounded-xl">
                          <span className="text-[9px] uppercase tracking-wider text-blue-200 font-bold block">
                            Risk Level
                          </span>
                          <span className="font-bold text-white">
                            {msg.aiInsightCard.riskLevel}
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-300 italic bg-black/20 p-2.5 rounded-xl border border-white/5">
                        "{msg.aiInsightCard.quote}"
                      </p>
                    </div>
                  )}
                </div>

                {isMe && (
                  <img
                    src={msg.senderAvatar}
                    alt={msg.senderName}
                    className="w-8 h-8 rounded-xl object-cover shrink-0 ring-1 ring-slate-300 dark:ring-slate-700"
                  />
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isAgentTyping && (
            <div className="flex items-center gap-2 text-slate-400 text-xs py-1">
              <img
                src={activeConv?.agentAvatar}
                alt="Typing"
                className="w-6 h-6 rounded-lg object-cover"
              />
              <div className="flex items-center gap-1 bg-white dark:bg-slate-800 px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-700">
                <span className="w-1.5 h-1.5 bg-blue-900 dark:bg-blue-400 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-blue-900 dark:bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-blue-900 dark:bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] font-semibold text-slate-500 ml-1">
                  {activeConv?.agentName} is typing...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompt suggestions strip */}
        <div className="px-4 py-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 overflow-x-auto flex gap-2 no-scrollbar">
          <button
            onClick={() => handleSendMessage('Can we schedule a private viewing for this Saturday?')}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold whitespace-nowrap transition border border-slate-200/60 dark:border-slate-700"
          >
            📅 Book viewing this Saturday
          </button>
          <button
            onClick={() =>
              handleSendMessage('What is the projected gross rental yield and AI capital growth?')
            }
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold whitespace-nowrap transition border border-slate-200/60 dark:border-slate-700"
          >
            📊 Inquire about AI Yield & Score
          </button>
          <button
            onClick={() =>
              handleSendMessage(
                'Can you verify the clean RDB Land Title Deed status for this property?'
              )
            }
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold whitespace-nowrap transition border border-slate-200/60 dark:border-slate-700"
          >
            📑 Check RDB Title Deed
          </button>
        </div>

        {/* Chat Input Bar */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-3"
          >
            <button
              type="button"
              onClick={() => dispatch(setToastMessage('Attachment upload enabled for KYC dossiers & Title Deeds.'))}
              className="p-2.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Attach document"
            >
              <span className="material-symbols-outlined text-sm">attach_file</span>
            </button>

            <input
              type="text"
              placeholder={`Message ${activeConv?.agentName || 'Concierge'} about ${
                activeConv?.propertyTitle || 'properties'
              }...`}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-500 border border-slate-200 dark:border-slate-700"
            />

            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="p-3 rounded-2xl bg-blue-900 hover:bg-blue-800 text-white transition disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-blue-900/20"
              aria-label="Send message"
            >
              <span className="material-symbols-outlined text-base">send</span>
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};
