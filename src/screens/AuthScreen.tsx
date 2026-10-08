import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/index.ts';
import { loginSuccess, setSelectedRole } from '../store/authSlice.ts';
import { setActiveScreen, setToastMessage } from '../store/uiSlice.ts';
import { addNotification } from '../store/notificationsSlice.ts';
import { User, UserRole } from '../types/index.ts';

const ROLE_OPTIONS: { role: UserRole; title: string; subtitle: string; icon: string }[] = [
  {
    role: 'buyer',
    title: 'Acquiring Investor',
    subtitle: 'High-yield residential & commercial estates',
    icon: 'home',
  },
  {
    role: 'tenant',
    title: 'Diplomatic Tenant',
    subtitle: 'Furnished residences & long-term leases',
    icon: 'key',
  },
  {
    role: 'owner',
    title: 'Estate Owner',
    subtitle: 'List & track asset performance',
    icon: 'real_estate_agent',
  },
  {
    role: 'agent',
    title: 'Certified Agent',
    subtitle: 'Diaspora desk & advisory partner',
    icon: 'support_agent',
  },
  {
    role: 'staff',
    title: 'Staff / Admin',
    subtitle: 'Title deed audits & KYC governance',
    icon: 'verified_user',
  },
];

export const AuthScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { activeScreen } = useAppSelector((state) => state.ui);
  const { selectedRole } = useAppSelector((state) => state.auth);

  const [mode, setMode] = useState<'signin' | 'signup'>(
    activeScreen === 'signup' ? 'signup' : 'signin'
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>(selectedRole || 'buyer');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const mockUser: User = {
        id: `usr_${Date.now()}`,
        uid: `usr_${Date.now()}`,
        fullName: fullName || (email.split('@')[0] ? email.split('@')[0].toUpperCase() : 'Emma Gasana'),
        email: email || 'investor@horizon.rw',
        role: role,
        avatar:
          role === 'agent'
            ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGsxJf63wBNFLzunIniZ6gsts8iZTtMZMBoTk6qcnYAsJn3XfyZ39rQLLVMn7WvAju7ewdihcb_H1Wkh7WVLUMKL0vww1Mor9MDAArbRrP4W7a5Q13kl3aUWZIxQFVAmBbKTCBJEam6dRGoywvcU9BXvmA1IFEMV3wVhI1iR88iDQjMU3bWtxAEMkLoWxUmGSr7xXk_cQ5fbsyvVPvGj9HTPQDCXFXPngftFQfhxljNt_O7YxC4iFx-4BLXxMTtFsi4YQ3Cf0e1ohQ'
            : 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnC_CYf59wj1KWpQbKwTevMc93XUx8tDhFlMINQju0ESrB9wiHgs_Je71Nz198cKnEqi1SHyjucLymsHQleyHUKKjOaVMLWca93yqjqCO_vZwxG0bD4WCj7JtuktMjlttoB0Ub8Yaes96YQ3cjOww2JVjJk-4WXNVNT2QkV4Rw-mKfM2n3_kjJEoM1k9nrSkRnLvUtphuS-60KAtnmdbRetDo_rOh1IHTUZ8YPr85_2vJP71dxPx9kXxHfKdKnwXzIcajJxkoon9RB',
        token: `jwt_token_${Date.now()}`,
        provider: 'email',
      };

      dispatch(loginSuccess({ user: mockUser, token: mockUser.token! }));
      dispatch(setSelectedRole(role));
      dispatch(
        addNotification({
          userId: mockUser.id,
          title: 'Secure Session Initialized',
          message: `Welcome back, ${mockUser.fullName}. Verified OAuth2 session active.`,
          type: 'system',
        })
      );
      dispatch(setToastMessage(`Signed in as ${mockUser.fullName} (${role.toUpperCase()})`));
      setIsLoading(false);
      dispatch(setActiveScreen('dashboard'));
    }, 500);
  };

  const handleOAuthLogin = (provider: 'google' | 'github' | 'apple' | 'facebook') => {
    setIsLoading(true);
    setTimeout(() => {
      const mockOAuthUser: User = {
        id: `usr_${provider}_${Date.now()}`,
        uid: `usr_${provider}_${Date.now()}`,
        fullName:
          provider === 'google'
            ? 'Dany Mugisha (Google Verified)'
            : provider === 'github'
            ? 'Jean-Luc Tech (GitHub)'
            : 'Sovereign Client',
        email: `user.${provider}@horizon.rw`,
        role: role,
        avatar:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCbOCQQgrjyJcdDUlSDqisvb4q_jWQyrYx1NtAWRP8HYyLppVH6Qo6A5wNUPOWvD_ljinpLoYx9mZgzOFfKvYTNwoUCvmhRrKWG60FZbJ30qyXyNIxsd8QDwmpKtecoZhJqeg676QoqJCZrLsj25TntRP8DmufbHNkbLeNRePQ6GMRbIyh5I9eaSAxXsh-_sJV4wopfxf5lXW5rAqXl1yuSkrq8_6668sfGPWBAgElurOHj_GqlEoeez-zuU_dq-7r_lhYZaoNFQlfP',
        token: `oauth_jwt_${provider}_${Date.now()}`,
        provider,
      };

      dispatch(loginSuccess({ user: mockOAuthUser, token: mockOAuthUser.token! }));
      dispatch(
        addNotification({
          userId: mockOAuthUser.id,
          title: `${provider.toUpperCase()} OAuth2 Authenticated`,
          message: 'Signed in via single sign-on protocol.',
          type: 'system',
        })
      );
      dispatch(setToastMessage(`Signed in with ${provider.toUpperCase()}`));
      setIsLoading(false);
      dispatch(setActiveScreen('home'));
    }, 400);
  };

  const handleQuickDemoLogin = (demoRole: UserRole, demoName: string) => {
    const user: User = {
      id: `usr_${demoRole}`,
      uid: `usr_${demoRole}`,
      fullName: demoName,
      email: `${demoRole}@emma-dany.rw`,
      role: demoRole,
      avatar:
        demoRole === 'agent'
          ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGsxJf63wBNFLzunIniZ6gsts8iZTtMZMBoTk6qcnYAsJn3XfyZ39rQLLVMn7WvAju7ewdihcb_H1Wkh7WVLUMKL0vww1Mor9MDAArbRrP4W7a5Q13kl3aUWZIxQFVAmBbKTCBJEam6dRGoywvcU9BXvmA1IFEMV3wVhI1iR88iDQjMU3bWtxAEMkLoWxUmGSr7xXk_cQ5fbsyvVPvGj9HTPQDCXFXPngftFQfhxljNt_O7YxC4iFx-4BLXxMTtFsi4YQ3Cf0e1ohQ'
          : 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnC_CYf59wj1KWpQbKwTevMc93XUx8tDhFlMINQju0ESrB9wiHgs_Je71Nz198cKnEqi1SHyjucLymsHQleyHUKKjOaVMLWca93yqjqCO_vZwxG0bD4WCj7JtuktMjlttoB0Ub8Yaes96YQ3cjOww2JVjJk-4WXNVNT2QkV4Rw-mKfM2n3_kjJEoM1k9nrSkRnLvUtphuS-60KAtnmdbRetDo_rOh1IHTUZ8YPr85_2vJP71dxPx9kXxHfKdKnwXzIcajJxkoon9RB',
      token: `demo_jwt_token_${demoRole}`,
      provider: 'email',
    };

    dispatch(loginSuccess({ user, token: user.token! }));
    dispatch(setSelectedRole(demoRole));
    dispatch(setToastMessage(`Logged in as 1-Click Demo: ${demoName} (${demoRole.toUpperCase()})`));
    dispatch(setActiveScreen(demoRole === 'agent' ? 'chat' : 'dashboard'));
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-10 transition-colors">
      <div className="max-w-5xl w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* Left Column: Visual & Quote */}
        <div className="lg:col-span-5 bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950 text-white p-8 md:p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay" />
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            {/* Brand */}
            <div className="flex items-center gap-2 mb-8">
              <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center font-headline font-black text-sm">
                ED
              </div>
              <div>
                <span className="text-xl font-black tracking-tight font-headline block">
                  Emma & Dany
                </span>
                <span className="text-[9px] uppercase tracking-widest text-blue-300 font-label block">
                  The Digital Estate
                </span>
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-black font-headline tracking-tight leading-snug">
              Welcome to Rwanda's Premier Architectural Estate Agency.
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed mt-3 font-light">
              Access curated high-yield villas, verified land title deeds, and 24/7 private concierge advisory in Kigali.
            </p>
          </div>

          {/* Quick Demo Logins Container */}
          <div className="relative z-10 pt-8 mt-8 border-t border-white/10 space-y-3">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-300 block">
              ⚡ 1-Click Demo Profiles (Instant Test)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('buyer', 'Dany Mugisha')}
                className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[11px] font-semibold text-white text-left transition"
              >
                👤 Investor Dany
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('owner', 'Emma Gasana')}
                className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[11px] font-semibold text-white text-left transition"
              >
                🏛️ Owner Emma
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('agent', 'Agent Dany')}
                className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[11px] font-semibold text-white text-left transition"
              >
                💼 Senior Agent
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('staff', 'Admin Governance')}
                className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[11px] font-semibold text-white text-left transition"
              >
                🛡️ RLMIS Staff
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Forms */}
        <div className="lg:col-span-7 p-8 md:p-10 flex flex-col justify-center">
          {/* Tabs */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
              <button
                onClick={() => setMode('signin')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition ${
                  mode === 'signin'
                    ? 'bg-white dark:bg-slate-900 text-blue-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition ${
                  mode === 'signup'
                    ? 'bg-white dark:bg-slate-900 text-blue-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Create Account
              </button>
            </div>

            <button
              onClick={() => dispatch(setActiveScreen('home'))}
              className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white font-semibold flex items-center gap-1"
            >
              <span>Back to Showcase</span>
              <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </button>
          </div>

          <h3 className="text-2xl font-black font-headline text-slate-900 dark:text-white tracking-tight mb-1">
            {mode === 'signin' ? 'Sign in to Emma & Dany' : 'Join The Digital Estate'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            {mode === 'signin'
              ? 'Enter your credentials to access your Rwandan property portfolio'
              : 'Select your persona to unlock specialized real estate intelligence'}
          </p>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {mode === 'signup' && (
              <>
                {/* Role selection bento grid */}
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                    Select Your Real Estate Role
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {ROLE_OPTIONS.map((item) => (
                      <div
                        key={item.role}
                        onClick={() => setRole(item.role)}
                        className={`p-2.5 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                          role === item.role
                            ? 'border-blue-900 dark:border-blue-400 bg-blue-50/60 dark:bg-blue-950/40 ring-1 ring-blue-900/20'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-slate-50/50 dark:bg-slate-800/30'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="material-symbols-outlined text-sm text-blue-900 dark:text-blue-400">
                            {item.icon}
                          </span>
                          <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {item.title}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 line-clamp-1">
                          {item.subtitle}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dany Mugisha"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="name@organization.rw"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-blue-900"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => dispatch(setToastMessage('Password reset link sent.'))}
                    className="text-[11px] text-blue-900 dark:text-blue-400 font-bold hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-blue-900"
              />
            </div>

            {mode === 'signin' && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember-me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-blue-900"
                />
                <label
                  htmlFor="remember-me"
                  className="text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer"
                >
                  Remember session on this device
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs sm:text-sm tracking-tight transition shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                  Verifying Credentials...
                </>
              ) : mode === 'signin' ? (
                'Sign In'
              ) : (
                'Create Verified Account'
              )}
            </button>
          </form>

          {/* Social OAuth2 Separator */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <span className="relative px-3 bg-white dark:bg-slate-900 text-[10px] font-black uppercase tracking-wider text-slate-400">
              Or Authenticate Via OAuth2
            </span>
          </div>

          {/* Social OAuth2 Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              type="button"
              onClick={() => handleOAuthLogin('google')}
              className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleOAuthLogin('github')}
              className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </button>

            <button
              type="button"
              onClick={() => handleOAuthLogin('apple')}
              className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.06 1.72-.93 2.74 1 .08 2.01-.5 2.63-1.24z" />
              </svg>
              <span>Apple</span>
            </button>

            <button
              type="button"
              onClick={() => handleOAuthLogin('facebook')}
              className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Facebook</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
