import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationItem } from '../types/index.ts';

interface NotificationsState {
  items: NotificationItem[];
  isOpen: boolean;
}

const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'usr_default_1',
    title: 'Viewing Scheduled',
    message: 'Your VIP walkthrough for Kigali View Heights has been confirmed with Agent Dany for tomorrow at 10:00 AM.',
    type: 'viewing',
    read: false,
    time: '5m ago',
  },
  {
    id: 'notif-2',
    userId: 'usr_default_1',
    title: 'Price Drop Alert',
    message: 'The Palms Garden View was reduced from $280,000 to $260,000.',
    type: 'price_drop',
    read: false,
    time: '1h ago',
  },
  {
    id: 'notif-3',
    userId: 'usr_default_1',
    title: 'New AI Property Match',
    message: 'Kacyiru Executive Suite matches 98% of your architectural and investment criteria in Kigali.',
    type: 'match',
    read: true,
    time: '3h ago',
  },
  {
    id: 'notif-4',
    userId: 'usr_default_1',
    title: 'New Client Inquiry',
    message: 'Diaspora investor requested legal vetting documents for Bugesera Industrial Plot.',
    type: 'inquiry',
    read: true,
    time: '1d ago',
  },
];

const initialState: NotificationsState = {
  items: initialNotifications,
  isOpen: false,
};

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (
      state,
      action: PayloadAction<
        Omit<NotificationItem, 'id' | 'read' | 'time'> & {
          id?: string;
          read?: boolean;
          time?: string;
        }
      >
    ) => {
      const fullItem: NotificationItem = {
        id: action.payload.id || `notif-${Date.now()}`,
        read: action.payload.read ?? false,
        time: action.payload.time || 'Just now',
        userId: action.payload.userId,
        title: action.payload.title,
        message: action.payload.message,
        type: action.payload.type,
      };
      state.items.unshift(fullItem);
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const item = state.items.find((n) => n.id === action.payload);
      if (item) {
        item.read = true;
      }
    },
    markAllAsRead: (state) => {
      state.items.forEach((n) => {
        n.read = true;
      });
    },
    toggleNotificationDrawer: (state) => {
      state.isOpen = !state.isOpen;
    },
    setNotificationDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
  },
});

export const { addNotification, markAsRead, markAllAsRead, toggleNotificationDrawer, setNotificationDrawerOpen } =
  notificationsSlice.actions;

export default notificationsSlice.reducer;
