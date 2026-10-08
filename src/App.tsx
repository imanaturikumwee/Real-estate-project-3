/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store, useAppDispatch, useAppSelector } from './store/index.ts';
import { Navbar } from './components/Navbar.tsx';
import { NotificationDrawer } from './components/NotificationDrawer.tsx';
import { BookingModal } from './components/BookingModal.tsx';
import { AddPropertyModal } from './components/AddPropertyModal.tsx';
import { ValuationModal } from './components/ValuationModal.tsx';
import { Toast } from './components/Toast.tsx';
import { HomeScreen } from './screens/HomeScreen.tsx';
import { ChatScreen } from './screens/ChatScreen.tsx';
import { DashboardScreen } from './screens/DashboardScreen.tsx';
import { AuthScreen } from './screens/AuthScreen.tsx';
import { getSocket } from './lib/socket.ts';
import { addNotification } from './store/notificationsSlice.ts';
import { setToastMessage } from './store/uiSlice.ts';

const EstateApp: React.FC = () => {
  const dispatch = useAppDispatch();
  const { activeScreen, darkMode } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);

  // Sync dark mode class with root html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Connect socket and listen for real-time portfolio alerts
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on('connect', () => {
      // connected to real-time sync server
    });

    socket.on('notification', (data: { title: string; message: string; type?: any }) => {
      dispatch(
        addNotification({
          userId: user?.id || 'usr_default_1',
          title: data.title,
          message: data.message,
          type: data.type || 'system',
        })
      );
      dispatch(setToastMessage(`${data.title}: ${data.message}`));
    });

    return () => {
      socket.off('connect');
      socket.off('notification');
    };
  }, [dispatch, user?.id]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-body transition-colors">
      {/* Top Navigation */}
      <Navbar />

      {/* Screen Routing */}
      <main className="flex-1">
        {activeScreen === 'home' && <HomeScreen />}
        {activeScreen === 'chat' && <ChatScreen />}
        {activeScreen === 'dashboard' && <DashboardScreen />}
        {(activeScreen === 'signin' || activeScreen === 'signup') && <AuthScreen />}
      </main>

      {/* Interactive Global Modals & Overlays */}
      <BookingModal />
      <AddPropertyModal />
      <ValuationModal />
      <NotificationDrawer />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <EstateApp />
    </Provider>
  );
}
