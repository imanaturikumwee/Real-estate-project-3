import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/index.ts';
import { setActiveScreen, toggleDarkMode, toggleMobileMenu } from '../store/uiSlice.ts';
import { toggleNotificationDrawer } from '../store/notificationsSlice.ts';
import { logout, setSelectedRole } from '../store/authSlice.ts';
import { UserRole } from '../types/index.ts';

export const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { activeScreen, darkMode } = useAppSelector((state) => state.ui);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { items: notifications } = useAppSelector((state) => state.notifications);
  const { conversations } = useAppSelector((state) => state.chat);

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.read).length;
  const totalUnreadChats = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  const handleRoleChange = (role: UserRole) => {
    dispatch(setSelectedRole(role));
    setIsProfileMenuOpen(false);
  };

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 border-b border-surface-container-low dark:border-slate-800 transition-colors">
      <div className="flex justify-between items-center w-full px-6 md:px-10 py-3.5 max-w-screen-2xl mx-auto">
        {/* Left: Brand & Navigation */}
        <div className="flex items-center gap-8 lg:gap-12">
          <button
            onClick={() => dispatch(setActiveScreen('home'))}
            className="flex items-center gap-2 text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-headline font-black text-sm tracking-tighter shadow-md">
              ED
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tighter text-blue-900 dark:text-white font-headline block leading-tight">
                Emma & Dany
              </span>
              <span className="text-[9px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-label block -mt-0.5">
                The Digital Estate
              </span>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-8 font-headline text-sm font-semibold tracking-tight">
            <button
              onClick={() => dispatch(setActiveScreen('home'))}
              className={`pb-1 transition-all duration-200 ${
                activeScreen === 'home'
                  ? 'text-blue-900 dark:text-blue-400 border-b-2 border-blue-900 dark:border-blue-400 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-blue-900 dark:hover:text-blue-300'
              }`}
            >
              Properties
            </button>
            <button
              onClick={() => dispatch(setActiveScreen('dashboard'))}
              className={`pb-1 transition-all duration-200 ${
                activeScreen === 'dashboard'
                  ? 'text-blue-900 dark:text-blue-400 border-b-2 border-blue-900 dark:border-blue-400 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-blue-900 dark:hover:text-blue-300'
              }`}
            >
              Estate Manager
            </button>
            <button
              onClick={() => dispatch(setActiveScreen('chat'))}
              className={`pb-1 transition-all duration-200 flex items-center gap-1.5 ${
                activeScreen === 'chat'
                  ? 'text-blue-900 dark:text-blue-400 border-b-2 border-blue-900 dark:border-blue-400 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-blue-900 dark:hover:text-blue-300'
              }`}
            >
              Concierge
              {totalUnreadChats > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              )}
            </button>
            <a
              href="#smart-matching"
              onClick={() => {
                dispatch(setActiveScreen('home'));
                setTimeout(() => {
                  document.getElementById('smart-matching')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="text-slate-600 dark:text-slate-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors"
            >
              AI Guide
            </a>
          </nav>
        </div>

        {/* Right: Actions, Notifications, Dark mode, Profile */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* Dark Mode Toggle */}
          <button
            onClick={() => dispatch(toggleDarkMode())}
            title="Toggle theme"
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 dark:text-slate-400"
          >
            <span className="material-symbols-outlined text-[20px]">
              {darkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => dispatch(toggleNotificationDrawer())}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 dark:text-slate-400 relative"
              title="Notifications"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              {unreadNotifs > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadNotifs}
                </span>
              )}
            </button>
          </div>

          {/* Chat Icon Button */}
          <button
            onClick={() => dispatch(setActiveScreen('chat'))}
            className={`p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative ${
              activeScreen === 'chat'
                ? 'text-blue-900 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                : 'text-slate-500 dark:text-slate-400'
            }`}
            title="Active Chats"
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={{ fontVariationSettings: activeScreen === 'chat' ? "'FILL' 1" : "'FILL' 0" }}
            >
              chat_bubble
            </span>
            {totalUnreadChats > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
            )}
          </button>

          {/* User Profile / Auth State */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 p-1 pl-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all border border-slate-200 dark:border-slate-700"
              >
                <div className="hidden lg:block text-right">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                    {user.fullName}
                  </p>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-800 dark:text-blue-400 capitalize">
                    {user.role}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 ring-2 ring-primary/20">
                  <img
                    src={user.avatar}
                    alt={user.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </button>

              {/* Profile Dropdown */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-800 py-3 z-50 text-sm">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="font-bold text-slate-900 dark:text-white">{user.fullName}</p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-300 text-[10px] font-bold uppercase tracking-widest">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Active Session (JWT)
                    </div>
                  </div>

                  <div className="px-2 py-1.5 border-b border-slate-100 dark:border-slate-800">
                    <p className="px-2 py-1 text-[10px] uppercase tracking-wider font-bold text-slate-400">
                      Switch Role View
                    </p>
                    {(['buyer', 'tenant', 'owner', 'agent', 'staff'] as UserRole[]).map((r) => (
                      <button
                        key={r}
                        onClick={() => handleRoleChange(r)}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs capitalize flex items-center justify-between ${
                          user.role === r
                            ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-900 dark:text-blue-300 font-bold'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        {r}
                        {user.role === r && (
                          <span className="material-symbols-outlined text-xs">check</span>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="px-2 pt-1.5">
                    <button
                      onClick={() => {
                        dispatch(setActiveScreen('dashboard'));
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">dashboard</span>
                      Estate Manager
                    </button>
                    <button
                      onClick={() => {
                        dispatch(setActiveScreen('chat'));
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">support_agent</span>
                      Active Concierge
                    </button>
                    <button
                      onClick={() => {
                        dispatch(logout());
                        setIsProfileMenuOpen(false);
                        dispatch(setActiveScreen('signin'));
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">logout</span>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => dispatch(setActiveScreen('signin'))}
                className="px-4 py-2 text-xs font-bold font-headline text-blue-900 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => dispatch(setActiveScreen('signup'))}
                className="px-4 py-2 text-xs font-bold font-headline text-white bg-primary rounded-lg hover:opacity-90 transition-all shadow-md shadow-primary/20"
              >
                Join Estate
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => dispatch(toggleMobileMenu())}
            className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>
    </header>
  );
};
