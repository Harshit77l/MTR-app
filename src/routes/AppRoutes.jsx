import { Navigate, Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import MovieDetails from '../pages/MovieDetails'
import SelectTheatre from '../pages/SelectTheatre'
import Schedule from '../pages/Schedule'
import SeatSelection from '../pages/SeatSelection'
import BookingSummary from '../pages/BookingSummary'
import Checkout from '../pages/Checkout'
import PaymentSuccess from '../pages/PaymentSuccess'
import Tickets from '../pages/Tickets'
import Favorites from '../pages/Favorites'
import Profile from '../pages/Profile'
import Login from '../pages/Login'
import Register from '../pages/Register'
import ProtectedRoute from './ProtectedRoute'

function Protected({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Protected><Home /></Protected>} />
      <Route path="/movies/:movieId" element={<Protected><MovieDetails /></Protected>} />
      <Route path="/movies/:movieId/theatres" element={<Protected><SelectTheatre /></Protected>} />
      <Route path="/movies/:movieId/schedule" element={<Protected><Schedule /></Protected>} />
      <Route path="/movies/:movieId/seats" element={<Protected><SeatSelection /></Protected>} />
      <Route path="/movies/:movieId/summary" element={<Protected><BookingSummary /></Protected>} />
      <Route path="/movies/:movieId/checkout" element={<Protected><Checkout /></Protected>} />
      <Route path="/movies/:movieId/success" element={<Protected><PaymentSuccess /></Protected>} />
      <Route path="/tickets" element={<Protected><Tickets /></Protected>} />
      <Route path="/favorites" element={<Protected><Favorites /></Protected>} />
      <Route path="/profile" element={<Protected><Profile /></Protected>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
