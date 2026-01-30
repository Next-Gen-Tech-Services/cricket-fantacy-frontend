import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/user`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['UserMatches', 'UserLeagues'],
  endpoints: (builder) => ({
    getUserMatches: builder.query({
      query: () => '/matches',
      providesTags: ['UserMatches'],
    }),
    getUserLeagues: builder.query({
      query: () => '/leagues',
      providesTags: ['UserLeagues'],
    }),
    getMatchDetails: builder.query({
      query: (matchId) => `/matches/${matchId}/details`,
      providesTags: (result, error, matchId) => [
        { type: 'UserMatches', id: matchId },
      ],
    }),
    getLeagueDetails: builder.query({
      query: (leagueId) => `/leagues/${leagueId}/details`,
      providesTags: (result, error, leagueId) => [
        { type: 'UserLeagues', id: leagueId },
      ],
    }),
  }),
});

export const {
  useGetUserMatchesQuery,
  useGetUserLeaguesQuery,
  useGetMatchDetailsQuery,
  useGetLeagueDetailsQuery,
} = userApi;