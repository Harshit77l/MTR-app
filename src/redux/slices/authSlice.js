import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../api/api'

function getErrorMessage(error) {
  return error.response?.data?.error || error.message || 'Something went wrong'
}

const request = (type, method, url) =>
  createAsyncThunk(type, async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api[method](url, payload)
      return data.data
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  })

export const register = request('auth/register', 'post', '/auth/register')
export const login = request('auth/login', 'post', '/auth/login')
export const restoreSession = createAsyncThunk(
  'auth/restoreSession',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/auth/me')
      return data.data.user
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    user: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout(state) {
      state.token = null
      state.user = null
      state.status = 'idle'
      state.error = null
    },
    clearAuthError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'authenticated'
        state.token = action.payload.token
        state.user = action.payload.user
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || action.error.message
      })
      .addCase(login.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'authenticated'
        state.token = action.payload.token
        state.user = action.payload.user
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || action.error.message
      })
      .addCase(restoreSession.pending, (state) => {
        state.status = 'restoring'
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.status = 'authenticated'
        state.user = action.payload
        state.error = null
      })
      .addCase(restoreSession.rejected, (state) => {
        state.status = 'anonymous'
        state.token = null
        state.user = null
        state.error = null
      })
  },
})

export const { logout, clearAuthError } = authSlice.actions
export const selectAuth = (state) => state.auth
export const selectCurrentUser = (state) => state.auth.user
export const selectAuthToken = (state) => state.auth.token
export const selectIsAuthenticated = (state) => Boolean(state.auth.token && state.auth.user)
export const selectAuthStatus = (state) => state.auth.status
export const selectAuthError = (state) => {
  const error = state.auth.error
  return typeof error === 'string' ? error : error?.message || null
}

export default authSlice.reducer
