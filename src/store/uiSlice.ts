import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppScreen, Property } from '../types/index.ts';

interface UIState {
  activeScreen: AppScreen;
  darkMode: boolean;
  isBookingModalOpen: boolean;
  isAddPropertyModalOpen: boolean;
  isValuationModalOpen: boolean;
  selectedPropertyForBooking: Property | null;
  toastMessage: string | null;
  mobileMenuOpen: boolean;
}

const initialState: UIState = {
  activeScreen: 'home',
  darkMode: false,
  isBookingModalOpen: false,
  isAddPropertyModalOpen: false,
  isValuationModalOpen: false,
  selectedPropertyForBooking: null,
  toastMessage: null,
  mobileMenuOpen: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveScreen: (state, action: PayloadAction<AppScreen>) => {
      state.activeScreen = action.payload;
      state.mobileMenuOpen = false;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      if (typeof document !== 'undefined') {
        if (state.darkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    },
    setBookingModalOpen: (state, action: PayloadAction<{ open: boolean; property?: Property }>) => {
      state.isBookingModalOpen = action.payload.open;
      if (action.payload.property) {
        state.selectedPropertyForBooking = action.payload.property;
      }
    },
    setAddPropertyModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isAddPropertyModalOpen = action.payload;
    },
    setValuationModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isValuationModalOpen = action.payload;
    },
    setToastMessage: (state, action: PayloadAction<string | null>) => {
      state.toastMessage = action.payload;
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
  },
});

export const {
  setActiveScreen,
  toggleDarkMode,
  setBookingModalOpen,
  setAddPropertyModalOpen,
  setValuationModalOpen,
  setToastMessage,
  toggleMobileMenu,
} = uiSlice.actions;

export default uiSlice.reducer;
