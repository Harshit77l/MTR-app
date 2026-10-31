import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../api/api'

export const fetchSeats = createAsyncThunk('seats/fetchSeats', async (showtimeId) => {
  const { data } = await api.get(`/showtimes/${showtimeId}/seats`)
  return data.data
})

const seatSlice = createSlice({
  name: 'seats',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    toggleSeat(state, action) {
      const seatNumber = action.payload
      const seat = state.items.find((item) => item.seatNumber === seatNumber)
      if (!seat || seat.status === 'occupied') return

      const currentlySelectedCount = state.items.filter((item) => item.selected).length
      // Enforce maximum 6 seats limit
      if (!seat.selected && currentlySelectedCount >= 6) return

      seat.selected = !seat.selected
    },
    clearSelectedSeats(state) {
      state.items.forEach((seat) => {
        seat.selected = false
      })
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSeats.pending, (state) => {
        state.status = 'loading'
        state.error = null
        state.items = []
      })
      .addCase(fetchSeats.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload.map((seat) => ({ ...seat, selected: false }))
      })
      .addCase(fetchSeats.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export const { toggleSeat, clearSelectedSeats } = seatSlice.actions
export const selectSeats = (state) => state.seats.items
export const selectSelectedSeats = (state) =>
  state.seats.items.filter((seat) => seat.selected).map((seat) => seat.seatNumber)
export const selectSeatStatus = (state) => state.seats.status
export const selectSeatError = (state) => state.seats.error

export default seatSlice.reducer
