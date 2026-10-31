import { useNavigate, useParams } from 'react-router-dom'
import BottomNav from '../components/common/BottomNav'
import PageHeader from '../components/common/PageHeader'
import PrimaryButton from '../components/common/PrimaryButton'
import SeatLegend from '../components/seats/SeatLegend'
import SeatMap from '../components/seats/SeatMap'
import { useBooking } from '../hooks/useBooking'
import { formatCurrency } from '../utils/format'
import { useDispatch, useSelector } from 'react-redux'
import { selectMovieById } from '../redux/slices/movieSlice'
import { updateSelection } from '../redux/slices/bookingSlice'
import {
  fetchSeats,
  selectSeatError,
  selectSeatStatus,
  selectSeats,
} from '../redux/slices/seatSlice'
import { useEffect } from 'react'

export default function SeatSelection() {
  const { movieId } = useParams()
  const navigate = useNavigate()
  const { selection, ticketsTotal, toggleSeat } = useBooking()
  const movie = useSelector((state) => selectMovieById(state, movieId))
  const seats = useSelector(selectSeats)
  const seatStatus = useSelector(selectSeatStatus)
  const seatError = useSelector(selectSeatError)
  const dispatch = useDispatch()

  useEffect(() => {
    if (selection.showtimeId) {
      dispatch(fetchSeats(selection.showtimeId))
    }
  }, [dispatch, selection.showtimeId])

  useEffect(() => {
    if (seatStatus !== 'succeeded' || seats.length === 0) return

    const availableSeatNumbers = new Set(
      seats.filter((seat) => seat.status === 'available').map((seat) => seat.seatNumber),
    )
    const validSelectedSeats = selection.seats.filter((seat) =>
      availableSeatNumbers.has(seat),
    )

    if (validSelectedSeats.length !== selection.seats.length) {
      dispatch(updateSelection({ seats: validSelectedSeats }))
    }
  }, [dispatch, seatStatus, seats, selection.seats])

  if (!movie) {
    return <div className="flex flex-1 min-h-[844px] items-center justify-center bg-app p-5 text-sm text-slate-400">Loading seats...</div>
  }

  const selectedCount = selection.seats.length
  const maxSeatsReached = selectedCount >= 6

  return (
    <div className="relative flex-1 flex flex-col min-h-full bg-app">
      <div className="flex-1 pb-6">
        <PageHeader
          title="Select Seats"
          progress={70}
          onCancel={() => navigate('/')}
        />

        <div className="flex items-center justify-between px-5 pt-1 text-[13px]">
          <p className="text-slate-500">
            {selection.screen}
            <span className="ml-2 font-semibold text-brand">{selection.time}</span>
            <span className="ml-2 text-xs text-slate-400">({selectedCount}/6 seats)</span>
          </p>
          <p className="font-bold text-ink">{formatCurrency(ticketsTotal)}</p>
        </div>

        {maxSeatsReached && (
          <p className="px-5 pt-1 text-xs text-amber-600 font-medium">
            Maximum limit of 6 seats reached
          </p>
        )}

        <div className="mt-4">
          {seatStatus === 'loading' && (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand border-t-transparent mb-2" />
              <p className="text-sm">Loading seat availability...</p>
            </div>
          )}
          {seatError && <p className="px-5 py-4 text-sm text-rose-500">{seatError}</p>}
          {seatStatus === 'succeeded' && (
            <SeatMap seats={seats} selectedSeats={selection.seats} onToggle={toggleSeat} />
          )}
        </div>

        <div className="mt-6 px-5">
          <SeatLegend />
          <div className="mt-5">
            <PrimaryButton
              disabled={selection.seats.length === 0}
              onClick={() => navigate(`/movies/${movie.id}/summary`)}
            >
              {selectedCount > 0
                ? `View Booking Summary (${selectedCount} ${selectedCount === 1 ? 'Seat' : 'Seats'})`
                : 'Select at least 1 Seat'}
            </PrimaryButton>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
