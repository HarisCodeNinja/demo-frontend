import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IMessage, IModuleInfo } from '@/routers/chat/interface';
import { setLogout } from './sessionSlice';

export interface ChatState {
  messages: IMessage[];
  relatedModules: IModuleInfo[];
}

const initialState: ChatState = {
  messages: [],
  relatedModules: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage(state, action: PayloadAction<IMessage>) {
      state.messages.push(action.payload);
    },
    setMessages(state, action: PayloadAction<IMessage[]>) {
      state.messages = action.payload;
    },
    setRelatedModules(state, action: PayloadAction<IModuleInfo[]>) {
      state.relatedModules = action.payload;
    },
    clearChat(state) {
      state.messages = [];
      state.relatedModules = [];
    },
  },
  extraReducers: (builder) => {
    // Clear chat when user logs out
    builder.addCase(setLogout, () => {
      return initialState;
    });
  },
});

export const { addMessage, setMessages, setRelatedModules, clearChat } = chatSlice.actions;

export default chatSlice.reducer;
