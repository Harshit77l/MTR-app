import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../api/api'

function normalizeMovie(movie) {
  const poster = movie.poster || movie.banner
  const banner = movie.banner || poster
  const releaseDateLabel = movie.releaseDate
    ? new Date(movie.releaseDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : ''

  return {
    ...movie,
    id: movie._id,
    poster,
    banner,
    hero: movie.hero || banner || poster,
    detailsHero: movie.detailsHero || banner || poster,
    flowHero: movie.flowHero || banner || poster,
    genres: movie.genre || [],
    synopsis: movie.description || '',
    releaseDateLabel,
    rating: movie.rating || 0,
    detailRating: movie.detailRating || movie.rating || 0,
    ageRating: movie.ageRating || 'PG-13',
    ticketStill: movie.ticketStill || banner || poster,
  }
}

export const fetchMovies = createAsyncThunk('movies/fetchMovies', async () => {
  const { data } = await api.get('/movies')
  return data.data.map(normalizeMovie)
})

const movieSlice = createSlice({
  name: 'movies',
  initialState: {
    items: [],
    favorites: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    toggleFavorite(state, action) {
      const movieId = action.payload
      state.favorites = state.favorites.includes(movieId)
        ? state.favorites.filter((id) => id !== movieId)
        : [...state.favorites, movieId]
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export const { toggleFavorite } = movieSlice.actions
export const selectMovies = (state) => state.movies.items
export const selectMovieStatus = (state) => state.movies.status
export const selectMovieError = (state) => state.movies.error
export const selectFavoriteIds = (state) => state.movies.favorites
export const selectMovieById = (state, movieId) =>
  state.movies.items.find((movie) => movie.id === movieId)

export default movieSlice.reducer
