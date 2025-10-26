import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ISessionUser, ILanguage } from '@/interface/common';
// import { AVAILABLE_LANGUAGES } from '@/config/app';
import { AppArea } from '@/hooks/useCurrentArea';

// export type Languages = AVAILABLE_LANGUAGES;

export interface SessionState {
  user: ISessionUser | null;
  token: string | null;
  refreshToken: string | null;
  lang: string;
  dir: 'rtl' | 'ltr';
  isLoggedIn: boolean;
  isDarkTheme: boolean;
  isCompactTheme: boolean;
  isFullscreen: boolean;
  area: AppArea;
}

const initialState: SessionState = {
  user: null,
  token: null,
  refreshToken: null,
  lang: 'en',
  dir: 'ltr',
  isLoggedIn: false,
  isDarkTheme: false,
	isCompactTheme: false,
  area: 'default',
  isFullscreen: false,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSession(state, action: PayloadAction<SessionState>) {
      // console.log(state)
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.isLoggedIn = action.payload.token !== null;
      return state;
    },
    setLanguage(state, action: PayloadAction<ILanguage>) {
      state.lang = action.payload.code;
      state.dir = action.payload.dir;
      return state;
    },
    toggleTheme(state) {
      // Add this reducer
      state.isDarkTheme = !state.isDarkTheme;
      return state;
    },
    toggleCompact(state) {
      // Add this reducer
      state.isCompactTheme = !state.isCompactTheme;
      return state;
    },
    toggleFullscreen(state) {
      state.isFullscreen = !state.isFullscreen;
      return state;
    },

    setArea(state, action: PayloadAction<AppArea>) {
      state.area = action.payload;
      return state;
    },

    setLogout(state) {
      // console.log(state)
      return initialState;
    },
  },
});

export const { setSession, setLanguage, setLogout, toggleTheme, toggleCompact, toggleFullscreen, setArea } = sessionSlice.actions;

export default sessionSlice.reducer;
