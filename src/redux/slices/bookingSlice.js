import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../api/api'
import { logout } from './authSlice'

const defaultBookingFee = Number(import.meta.env.VITE_BOOKING_FEE || 20)

function normalizeBooking(booking) {
  return {
    ...booking,
    id: booking._id,
    movieId: booking.movie?._id || booking.movie,
    movie: booking.movie,
    theatreName: booking.theatre?.name || '',
    theatre: booking.theatre,
    dateLabel: booking.showtime?.date
      ? new Date(booking.showtime.date).toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        })
      : '',
    time: booking.showtime?.startTime || '',
    screen: booking.showtime?.screenName || '',
    format: booking.showtime?.format || '',
    seats: booking.selectedSeats,
    amount: booking.totalAmount,
    transactionDate: booking.bookingDate
      ? new Date(booking.bookingDate).toLocaleString()
      : '',
  }
}

export const fetchBookings = createAsyncThunk('booking/fetchBookings', async () => {
  const { data } = await api.get('/bookings')
  return data.data.map(normalizeBooking)
})

export const createBooking = createAsyncThunk(
  'booking/createBooking',
  async ({ showtimeId, selectedSeats }) => {
    const { data } = await api.post('/bookings', { showtimeId, selectedSeats })
    return normalizeBooking(data.data)
  },
)

export const cancelBooking = createAsyncThunk('booking/cancelBooking', async (bookingId) => {
  const { data } = await api.patch(`/bookings/${bookingId}/cancel`)
  return normalizeBooking(data.data)
})

const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
    selection: {
      movieId: null,
      theatreId: null,
      dateId: null,
      showtimeId: null,
      format: null,
      screen: null,
      time: null,
      seats: [],
      ticketPrice: 0,
    },
    bookingDetails: null,
    bookings: [],
    status: 'idle',
    error: null,
    bookingsStatus: 'idle',
    bookingsError: null,
  },
  reducers: {
    updateSelection(state, action) {
      state.selection = { ...state.selection, ...action.payload }
    },
    clearBookingDetails(state) {
      state.bookingDetails = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout, (state) => {
        state.bookings = []
        state.bookingDetails = null
        state.bookingsStatus = 'idle'
        state.bookingsError = null
      })
      .addCase(fetchBookings.pending, (state) => {
        state.bookingsStatus = 'loading'
        state.bookingsError = null
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.bookingsStatus = 'succeeded'
        state.bookings = action.payload
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.bookingsStatus = 'failed'
        state.bookingsError = action.error.message
      })
      .addCase(createBooking.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.bookingDetails = action.payload
        state.bookings = [action.payload, ...state.bookings]
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(cancelBooking.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.status = 'succeeded'
        const index = state.bookings.findIndex((booking) => booking.id === action.payload.id)
        if (index >= 0) state.bookings[index] = action.payload
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export const { updateSelection, clearBookingDetails } = bookingSlice.actions
export const selectSelection = (state) => state.booking.selection
export const selectBookingDetails = (state) => state.booking.bookingDetails
export const selectBookings = (state) =>
  Array.isArray(state.booking.bookings) ? state.booking.bookings : []
export const selectBookingStatus = (state) => state.booking.status
export const selectBookingError = (state) => {
  const error = state.booking.error
  return typeof error === 'string' ? error : error?.message || null
}
export const selectBookingsStatus = (state) => state.booking.bookingsStatus
export const selectBookingsError = (state) => {
  const error = state.booking.bookingsError
  return typeof error === 'string' ? error : error?.message || null
}
export const selectTicketCount = (state) => state.booking.selection?.seats?.length || 0
export const selectTicketPrice = (state) => state.booking.selection?.ticketPrice || 0
export const selectTicketsTotal = (state) =>
  selectTicketCount(state) * selectTicketPrice(state)
export const selectBookingFee = (state) =>
  selectTicketCount(state) > 0 ? defaultBookingFee : 0
export const selectTotal = (state) => selectTicketsTotal(state) + selectBookingFee(state)

export default bookingSlice.reducer
