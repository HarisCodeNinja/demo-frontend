import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { setupListeners } from '@reduxjs/toolkit/query';

import { ENVIRONMENT, PERSIST_STORE_NAME } from "@/config/app";
import reducer from "./reducers";


const persistConfig = {
	key: PERSIST_STORE_NAME,
	keyPrefix: '',
	storage,
	whitelist: ['session', 'tableConfiguration']
}

const store = configureStore({
	reducer: persistReducer(persistConfig, reducer),
	middleware: (getDefaultMiddleware) => 
		getDefaultMiddleware({ serializableCheck: false }), 
	devTools: ENVIRONMENT === 'development',
})

setupListeners(store.dispatch);

const persistor = persistStore(store);
export { persistor, store };

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;