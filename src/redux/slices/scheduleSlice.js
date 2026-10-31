import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../api/api'

function normalizeTheatre(theatre) {
  return {
    ...theatre,
    id: theatre._id,
    priceLabel: theatre.priceLabel || '',
    logo: theatre.logo || '',
    logoBg: theatre.logoBg || '#eef0f7',
  }
}

function normalizeShowtime(showtime) {
  return {
    ...showtime,
    id: showtime._id,
    movieId: showtime.movie?._id || showtime.movie,
    theatreId: showtime.theatre?._id || showtime.theatre,
    screen: showtime.screenName,
    time: showtime.startTime,
    dateId: new Date(showtime.date).toISOString().slice(0, 10),
  }
}

export function toDateOption(dateId) {
  const date = new Date(`${dateId}T00:00:00`)
  return {
    id: dateId,
    weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
    day: date.toLocaleDateString('en-US', { day: 'numeric' }),
    label: date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    }),
  }
}

export const fetchTheatres = createAsyncThunk('schedule/fetchTheatres', async () => {
  const { data } = await api.get('/theatres')
  return data.data.map(normalizeTheatre)
})

export const fetchShowtimes = createAsyncThunk('schedule/fetchShowtimes', async () => {
  const { data } = await api.get('/showtimes')
  return data.data.map(normalizeShowtime)
})

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState: {
    theatres: [],
    showtimes: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTheatres.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchTheatres.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.theatres = action.payload
      })
      .addCase(fetchTheatres.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(fetchShowtimes.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchShowtimes.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.showtimes = action.payload
      })
      .addCase(fetchShowtimes.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export const selectTheatres = (state) => state.schedule.theatres
export const selectShowtimes = (state) => state.schedule.showtimes
export const selectScheduleStatus = (state) => state.schedule.status
export const selectScheduleError = (state) => state.schedule.error
export const selectTheatreById = (state, theatreId) =>
  state.schedule.theatres.find((theatre) => theatre.id === theatreId)
export const selectShowtimeById = (state, showtimeId) =>
  state.schedule.showtimes.find((showtime) => showtime.id === showtimeId)

export default scheduleSlice.reducer
