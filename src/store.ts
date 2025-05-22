import { configureStore } from '@reduxjs/toolkit';
import { todoSlice } from './slices/todoSlice';

export const store = configureStore({
  reducer: {
    [todoSlice.reducerPath]: todoSlice.reducer,
    // other reducers can be added here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(todoSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
