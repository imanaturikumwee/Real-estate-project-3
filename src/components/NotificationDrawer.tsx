import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/index.ts';
import {
  markAsRead,
  markAllAsRead,
  setNotificationDrawerOpen,
} from '../store/notificationsSlice.ts';
import { setActiveScreen } from '../store/uiSlice.ts';

export const NotificationDrawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items: notifications, isOpen } = useAppSelector((state) => state.notifications);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={() => dispatch(setNotificationDrawerOpen(false))}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col border-l border-slate-100 dark:border-slate-800">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-900 dark:text-blue-300 flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">notifications</span>
              </div>
              <div>
                <h3 className="font-headline font-bold text-lg text-slate-900 dark:text-white">
                  Live Notifications
                </h3>
                <p className="text-xs text-slate-400">Real-time estate & concierge alerts</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => dispatch(markAllAsRead())}
                className="text-xs text-blue-900 dark:text-blue-400 font-bold hover:underline"
              >
                Mark all read
              </button>
              <button
                onClick={() => dispatch(setNotificationDrawerOpen(false))}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <span className="material-symbols-outlined text-4xl mb-2 opacity-50">
                  notifications_off
                </span>
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notif) => {
                const getIcon = () => {
                  switch (notif.type) {
                    case 'viewing':
                      return 'calendar_today';
                    case 'price_drop':
                      return 'trending_down';
                    case 'match':
                      return 'auto_awesome';
                    case 'inquiry':
                      return 'support_agent';
                    default:
                      return 'info';
                  }
                };

                return (
                  <div
                    key={notif.id}
                    onClick={() => {
                      dispatch(markAsRead(notif.id));
                      if (notif.type === 'viewing' || notif.type === 'inquiry') {
                        dispatch(setActiveScreen('chat'));
                        dispatch(setNotificationDrawerOpen(false));
                      }
                    }}
                    className={`p-4 rounded-xl transition-all cursor-pointer border ${
                      !notif.read
                        ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/50 shadow-xs'
                        : 'bg-white dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-900 dark:text-blue-300 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-sm">{getIcon()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">
                            {notif.title}
                          </h4>
                          <span className="text-[10px] text-slate-400">{notif.time}</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          {notif.message}
                        </p>
                      </div>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1.5"></span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-[11px] text-slate-400">
              ⚡ Connected to Socket.io WebSockets for live sync
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
