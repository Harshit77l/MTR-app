import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { createTransform, persistReducer, persistStore } from 'redux-persist'
import bookingReducer from './slices/bookingSlice'
import movieReducer from './slices/movieSlice'
import scheduleReducer from './slices/scheduleSlice'
import seatReducer from './slices/seatSlice'
import authReducer from './slices/authSlice'

const storage = {
  getItem: (key) => Promise.resolve(localStorage.getItem(key)),
  setItem: (key, value) => Promise.resolve(localStorage.setItem(key, value)),
  removeItem: (key) => Promise.resolve(localStorage.removeItem(key)),
}

const bookingTransform = createTransform(
  (state) => ({
    selection: state?.selection || null,
    bookingDetails: state?.bookingDetails || null,
  }),
  (state) => ({
    selection: {
      movieId: null,
      theatreId: null,
      dateId: null,
      showtimeId: null,
      format: null,
      screen: null,
      time: null,
      ticketPrice: 0,
      ...(state?.selection || {}),
      seats: Array.isArray(state?.selection?.seats) ? state.selection.seats : [],
    },
    bookingDetails: state?.bookingDetails || null,
    bookings: [],
    status: 'idle',
    error: null,
    bookingsStatus: 'idle',
    bookingsError: null,
  }),
)

const rootReducer = combineReducers({
  auth: persistReducer(
    {
      key: 'auth-v2',
      version: 2,
      storage,
      transforms: [
        createTransform(
          (state) => ({ token: state?.token || null, user: state?.user || null }),
          (state) => ({
            token: state?.token || null,
            user: state?.user || null,
            status: state?.token && state?.user ? 'authenticated' : 'anonymous',
            error: null,
          }),
        ),
      ],
    },
    authReducer,
  ),
  booking: persistReducer(
    {
      key: 'booking-v2',
      version: 2,
      storage,
      transforms: [bookingTransform],
    },
    bookingReducer,
  ),
  movies: movieReducer,
  schedule: scheduleReducer,
  seats: seatReducer,
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
})

let syncedToken = null
store.subscribe(() => {
  const token = store.getState().auth.token
  if (token !== syncedToken) {
    syncedToken = token
    if (token) localStorage.setItem('auth-token', token)
    else localStorage.removeItem('auth-token')
  }
})

export const persistor = persistStore(store)
