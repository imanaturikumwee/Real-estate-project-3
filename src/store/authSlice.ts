import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserRole } from '../types/index.ts';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  selectedRole: UserRole;
  loading: boolean;
  error: string | null;
}

const defaultUser: User = {
  id: 'usr_default_1',
  uid: 'usr_default_1',
  fullName: 'Dany Mugisha',
  email: 'dany.mugisha@horizon.rw',
  role: 'owner',
  phone: '+250 788 123 456',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnC_CYf59wj1KWpQbKwTevMc93XUx8tDhFlMINQju0ESrB9wiHgs_Je71Nz198cKnEqi1SHyjucLymsHQleyHUKKjOaVMLWca93yqjqCO_vZwxG0bD4WCj7JtuktMjlttoB0Ub8Yaes96YQ3cjOww2JVjJk-4WXNVNT2QkV4Rw-mKfM2n3_kjJEoM1k9nrSkRnLvUtphuS-60KAtnmdbRetDo_rOh1IHTUZ8YPr85_2vJP71dxPx9kXxHfKdKnwXzIcajJxkoon9RB',
  provider: 'google',
};

const savedToken = typeof window !== 'undefined' ? localStorage.getItem('estate_token') : null;

const initialState: AuthState = {
  user: defaultUser,
  token: savedToken || 'mock_jwt_estate_token_secure_session',
  isAuthenticated: true,
  selectedRole: 'buyer',
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSelectedRole: (state, action: PayloadAction<UserRole>) => {
      state.selectedRole = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
      if (typeof window !== 'undefined') {
        localStorage.setItem('estate_token', action.payload.token);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('estate_token');
      }
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { setSelectedRole, setLoading, setError, loginSuccess, logout, updateProfile } = authSlice.actions;
export default authSlice.reducer;
