import { BrowserRouter } from 'react-router-dom'
import AppShell from './components/common/AppShell'
import AppRoutes from './routes/AppRoutes'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMovies } from './redux/slices/movieSlice'
import { fetchShowtimes, fetchTheatres } from './redux/slices/scheduleSlice'
import { fetchBookings } from './redux/slices/bookingSlice'
import { restoreSession, selectIsAuthenticated, selectAuthToken } from './redux/slices/authSlice'

export default function App() {
  const dispatch = useDispatch()
  const token = useSelector(selectAuthToken)
  const isAuthenticated = useSelector(selectIsAuthenticated)

  useEffect(() => {
    if (!token) return
    dispatch(restoreSession())
  }, [dispatch, token])

  useEffect(() => {
    dispatch(fetchMovies())
    dispatch(fetchTheatres())
    dispatch(fetchShowtimes())
  }, [dispatch])

  useEffect(() => {
    if (!isAuthenticated) return
    dispatch(fetchBookings())
  }, [dispatch, isAuthenticated])

  return (
    <BrowserRouter>
      <AppShell>
        <AppRoutes />
      </AppShell>
    </BrowserRouter>
  )
}
