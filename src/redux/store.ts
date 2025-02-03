import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import utilsReducer from './slices/utilsSlice';


const store = configureStore({
  reducer: {
    auth: authReducer,
    utils: utilsReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
