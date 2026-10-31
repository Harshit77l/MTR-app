import { useDispatch, useSelector } from 'react-redux'
import {
  cancelBooking as cancelBookingThunk,
  createBooking,
  selectBookingFee,
  selectBookingStatus,
  selectBookings,
  selectBookingError,
  selectSelection,
  selectTicketCount,
  selectTicketsTotal,
  selectTotal,
  updateSelection,
} from '../redux/slices/bookingSlice'
import { selectFavoriteIds, toggleFavorite } from '../redux/slices/movieSlice'
import { selectMovieById } from '../redux/slices/movieSlice'
import { selectTheatreById } from '../redux/slices/scheduleSlice'
import { toggleSeat as toggleSeatAction } from '../redux/slices/seatSlice'

export function useBooking() {
  const dispatch = useDispatch()
  const selection = useSelector(selectSelection)
  const favorites = useSelector(selectFavoriteIds)
  const bookings = useSelector(selectBookings)
  const movie = useSelector((state) => selectMovieById(state, selection.movieId))
  const theatre = useSelector((state) => selectTheatreById(state, selection.theatreId))

  return {
    selection,
    movie,
    theatre,
    favorites,
    bookings,
    ticketCount: useSelector(selectTicketCount),
    ticketsTotal: useSelector(selectTicketsTotal),
    bookingFee: useSelector(selectBookingFee),
    total: useSelector(selectTotal),
    bookingStatus: useSelector(selectBookingStatus),
    bookingError: useSelector(selectBookingError),
    updateSelection: (partial) => dispatch(updateSelection(partial)),
    toggleFavorite: (movieId) => dispatch(toggleFavorite(movieId)),
    toggleSeat: (seatId) => {
      const isSelected = selection.seats.includes(seatId)
      // Enforce maximum 6 seats limit
      if (!isSelected && selection.seats.length >= 6) {
        return
      }
      dispatch(toggleSeatAction(seatId))
      const currentSeats = isSelected
        ? selection.seats.filter((seat) => seat !== seatId)
        : [...selection.seats, seatId]
      dispatch(updateSelection({ seats: currentSeats }))
    },
    confirmBooking: (payload) => dispatch(createBooking(payload)),
    cancelBooking: (bookingId) => dispatch(cancelBookingThunk(bookingId)),
  }
}
