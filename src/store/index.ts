import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from './authSlice.ts';
import propertiesReducer from './propertiesSlice.ts';
import chatReducer from './chatSlice.ts';
import notificationsReducer from './notificationsSlice.ts';
import uiReducer from './uiSlice.ts';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    properties: propertiesReducer,
    chat: chatReducer,
    notifications: notificationsReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
