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

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/movies/:movieId" element={<MovieDetails />} />
      <Route path="/movies/:movieId/theatres" element={<SelectTheatre />} />
      <Route path="/movies/:movieId/schedule" element={<Schedule />} />
      <Route path="/movies/:movieId/seats" element={<SeatSelection />} />
      <Route path="/movies/:movieId/summary" element={<BookingSummary />} />
      <Route path="/movies/:movieId/checkout" element={<Checkout />} />
      <Route path="/movies/:movieId/success" element={<PaymentSuccess />} />
      <Route path="/tickets" element={<Tickets />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
