import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const todoSlice = createApi({
  reducerPath: 'todos',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://dummyjson.com',
    prepareHeaders: (headers) => {
      // Intercept & modify headers here (e.g. auth token)
      headers.set('Accept', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getTodos: builder.query<any, void>({
      query: () => '/todos?limit=6',
    }),
  }),
});

export const { useGetTodosQuery, useLazyGetTodosQuery } = todoSlice;