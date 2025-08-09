import { baseApi } from "./baseApi";

export const chatbotApi = baseApi.injectEndpoints({
  reducerPath: "chatbotApi",
  endpoints: (builder) => ({
    // Main chat functionality
    sendMessage: builder.mutation({
      query: ({ message, options = {}, sessionId = null }) => ({
        url: "chat",
        method: "POST",
        body: { message, options },
        headers: sessionId ? { "x-chatbot-session-id": sessionId } : {},
      }),
      transformResponse: (response) => response.data,
    }),

    // Training and feedback
    trainFromFeedback: builder.mutation({
      query: ({
        message,
        correctAgent,
        confidence = 1.0,
        sessionId = null,
      }) => ({
        url: "chat/train",
        method: "POST",
        body: { message, correctAgent, confidence },
        headers: sessionId ? { "x-chatbot-session-id": sessionId } : {},
      }),
      transformResponse: (response) => response.data,
    }),

    addTrainingExample: builder.mutation({
      query: ({ message, agentName, confidence = 1.0, source = "manual" }) => ({
        url: "chat/training/example",
        method: "POST",
        body: { message, agentName, confidence, source },
      }),
      transformResponse: (response) => response.data,
    }),

    // Stats and analytics
    getChatStats: builder.query({
      query: () => "chat/stats",
      transformResponse: (response) => response.data,
    }),

    // Session management
    createSession: builder.mutation({
      query: () => ({
        url: "chat/sessions",
        method: "POST",
      }),
      transformResponse: (response) => response.data,
    }),

    getUserSessions: builder.query({
      query: (limit = 10) => `chat/sessions/user?limit=${limit}`,
      transformResponse: (response) => response.data,
    }),

    getSessionStats: builder.query({
      query: (sessionId) => `chat/sessions/${sessionId}/stats`,
      transformResponse: (response) => response.data,
    }),

    clearSession: builder.mutation({
      query: (sessionId) => ({
        url: `chat/sessions/${sessionId}`,
        method: "DELETE",
      }),
      transformResponse: (response) => response.data,
    }),

    clearUserSessions: builder.mutation({
      query: () => ({
        url: "chat/sessions/user/all",
        method: "DELETE",
      }),
      transformResponse: (response) => response.data,
    }),

    // History management
    getConversationHistory: builder.query({
      query: (sessionId) => `chat/history/${sessionId}`,
      transformResponse: (response) => response.data,
    }),
  }),
});

export const {
  // Main chat
  useSendMessageMutation,

  // Training
  useTrainFromFeedbackMutation,
  useAddTrainingExampleMutation,

  // Stats
  useGetChatStatsQuery,

  // Session management
  useCreateSessionMutation,
  useGetUserSessionsQuery,
  useGetSessionStatsQuery,
  useClearSessionMutation,
  useClearUserSessionsMutation,

  // History
  useGetConversationHistoryQuery,
} = chatbotApi;
