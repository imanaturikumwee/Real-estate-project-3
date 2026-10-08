import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/index.ts';
import { setBookingModalOpen, setToastMessage, setActiveScreen } from '../store/uiSlice.ts';
import { addMessage } from '../store/chatSlice.ts';
import { addNotification } from '../store/notificationsSlice.ts';
import { getSocket } from '../lib/socket.ts';

export const BookingModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isBookingModalOpen, selectedPropertyForBooking } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);

  const [date, setDate] = useState('2026-10-10');
  const [time, setTime] = useState('10:00 AM');
  const [transportNeeded, setTransportNeeded] = useState(true);
  const [specialRequests, setSpecialRequests] = useState('Interested in diplomatic zoning analysis and deed verification.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isBookingModalOpen) return null;

  const property = selectedPropertyForBooking || {
    id: 'prop-1',
    title: 'Kigali View Heights',
    price: 450000,
    location: 'Rebero District, Kigali',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqWz3SlViR7Ll3TPo1pk7UyIlc5ixxcyhdje3zzQGZvLkgSW8TcZR7Z1EeMY2YGkDiXu0i1J5YoOMvebjNpKrM4_Gk3S1LuK2z6eT9OFcLVAUm3HfWPoDZfyKPkOrGcZkyYgREduu7sVbGHVOVGhc-fb63-H921dxhyhp6PrR8vrBJ0FDC1Aw6RBpu96Ld-C5zeAELKSDMep_c1jDsuEVtdZ4CoUD43GN5MKAfC-WjxV7VxC1CUgjhUmn7PAyPDFNeQY-TwtydZawP',
  };

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      // 1. Send live user message in chat
      const bookingMsg = {
        id: 'msg-' + Date.now(),
        conversationId: 'conv-1',
        senderId: user?.uid || 'usr_default_1',
        senderName: user?.fullName || 'You',
        senderAvatar: user?.avatar || '',
        senderRole: 'user' as const,
        text: `I've booked a private viewing for ${property.title} on ${date} at ${time}. ${
          transportNeeded ? 'Private transport from Kigali Heights requested.' : ''
        }`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      dispatch(addMessage(bookingMsg));

      // 2. Dispatch Agent Dany reply
      setTimeout(() => {
        const agentReply = {
          id: 'msg-reply-' + Date.now(),
          conversationId: 'conv-1',
          senderId: 'agent_dany',
          senderName: 'Agent Dany',
          senderAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGsxJf63wBNFLzunIniZ6gsts8iZTtMZMBoTk6qcnYAsJn3XfyZ39rQLLVMn7WvAju7ewdihcb_H1Wkh7WVLUMKL0vww1Mor9MDAArbRrP4W7a5Q13kl3aUWZIxQFVAmBbKTCBJEam6dRGoywvcU9BXvmA1IFEMV3wVhI1iR88iDQjMU3bWtxAEMkLoWxUmGSr7xXk_cQ5fbsyvVPvGj9HTPQDCXFXPngftFQfhxljNt_O7YxC4iFx-4BLXxMTtFsi4YQ3Cf0e1ohQ',
          senderRole: 'agent' as const,
          text: `Viewing confirmed for ${property.title} on ${date} at ${time}! Our chauffeur will meet you at the requested location with printed architectural schematics and master plans.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        dispatch(addMessage(agentReply));
      }, 1200);

      // 3. Add live notification
      dispatch(
        addNotification({
          id: 'notif-' + Date.now(),
          userId: user?.uid || 'usr_default_1',
          title: 'Viewing Confirmed',
          message: `Walkthrough confirmed for ${property.title} on ${date} at ${time}.`,
          type: 'viewing',
          read: false,
          time: 'Just now',
        })
      );

      // 4. Emit via Socket.io
      const socket = getSocket();
      socket.emit('book_viewing', {
        propertyId: property.id,
        propertyTitle: property.title,
        date,
        time,
        clientName: user?.fullName,
      });

      setIsSubmitting(false);
      dispatch(setBookingModalOpen({ open: false }));
      dispatch(setToastMessage(`Viewing scheduled for ${property.title} on ${date} at ${time}!`));
      dispatch(setActiveScreen('chat'));
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
        {/* Header with property snippet */}
        <div className="relative h-32 bg-slate-900 overflow-hidden">
          <img
            src={property.imageUrl}
            alt={property.title}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
          <button
            onClick={() => dispatch(setBookingModalOpen({ open: false }))}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
          <div className="absolute bottom-4 left-6 right-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
              VIP Walkthrough
            </span>
            <h3 className="text-xl font-headline font-bold text-white truncate">
              {property.title}
            </h3>
            <p className="text-xs text-slate-300 font-medium">
              ${Number(property.price).toLocaleString()} • {property.location}
            </p>
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleBooking} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Preferred Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-white font-medium focus:ring-2 focus:ring-primary outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Time Slot
              </label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-white font-medium focus:ring-2 focus:ring-primary outline-hidden"
              >
                <option value="09:00 AM">09:00 AM (Morning Sun)</option>
                <option value="10:00 AM">10:00 AM (Recommended)</option>
                <option value="12:00 PM">12:00 PM (Midday)</option>
                <option value="14:30 PM">02:30 PM (Afternoon)</option>
                <option value="17:00 PM">05:00 PM (Golden Hour Sunset)</option>
              </select>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={transportNeeded}
                onChange={(e) => setTransportNeeded(e.target.checked)}
                className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary"
              />
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Concierge Chauffeur Transfer
                </p>
                <p className="text-[11px] text-slate-500">
                  Complimentary pickup from Kigali Heights or Serena Hotel
                </p>
              </div>
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Specific Inquiries / Architectural Focus
            </label>
            <textarea
              rows={2}
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="e.g. Soil tests, valuation history, boundary surveys..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white font-medium focus:ring-2 focus:ring-primary outline-hidden resize-none"
            ></textarea>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => dispatch(setBookingModalOpen({ open: false }))}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                  Scheduling...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">calendar_month</span>
                  Confirm Viewing
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
