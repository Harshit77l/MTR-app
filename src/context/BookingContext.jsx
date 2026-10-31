import { useMemo, useState } from 'react'
import { BOOKING_FEE, SEAT_PRICE, movies, theatres } from '../data/mockData'
import { BookingContext } from './bookingContextObject'

const initialSelection = {
  movieId: 'meg-2',
  theatreId: 'grandview',
  dateId: 'fri-10',
  format: '2D',
  screen: 'Screen 1',
  time: '10:00 AM',
  seats: ['J9', 'J10'],
}

export function BookingProvider({ children }) {
  const [selection, setSelection] = useState(initialSelection)
  const [favorites, setFavorites] = useState([])
  const [bookings, setBookings] = useState([
    {
      id: 'bk-demo',
      movieId: 'meg-2',
      theatreName: 'The Grandview',
      dateLabel: 'Friday, October 10',
      time: '10:00 AM',
      screen: 'Screen 1',
      format: '2D',
      seats: ['H10', 'H10'],
      amount: 580,
      transactionDate: '10/9/2023 10:45 AM',
    },
  ])

  const movie = movies.find((item) => item.id === selection.movieId) || movies[0]
  const theatre = theatres.find((item) => item.id === selection.theatreId) || theatres[0]
  const ticketCount = selection.seats.length
  const ticketsTotal = ticketCount * SEAT_PRICE
  const total = ticketsTotal + (ticketCount > 0 ? BOOKING_FEE : 0)

  const value = useMemo(
    () => ({
      selection,
      movie,
      theatre,
      favorites,
      bookings,
      ticketCount,
      ticketsTotal,
      bookingFee: ticketCount > 0 ? BOOKING_FEE : 0,
      total,
      updateSelection: (partial) =>
        setSelection((current) => ({ ...current, ...partial })),
      toggleFavorite: (movieId) =>
        setFavorites((current) =>
          current.includes(movieId)
            ? current.filter((id) => id !== movieId)
            : [...current, movieId],
        ),
      toggleSeat: (seatId) =>
        setSelection((current) => {
          const exists = current.seats.includes(seatId)
          return {
            ...current,
            seats: exists
              ? current.seats.filter((id) => id !== seatId)
              : [...current.seats, seatId],
          }
        }),
      resetSeats: () =>
        setSelection((current) => ({ ...current, seats: [] })),
      confirmBooking: (payload) => {
        const booking = {
          id: `bk-${Date.now()}`,
          ...payload,
        }
        setBookings((current) => [booking, ...current])
        return booking
      },
      cancelBooking: (bookingId) =>
        setBookings((current) => current.filter((item) => item.id !== bookingId)),
    }),
    [selection, movie, theatre, favorites, bookings, ticketCount, ticketsTotal, total],
  )

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}
