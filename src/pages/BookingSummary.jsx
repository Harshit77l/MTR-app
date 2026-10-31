import { useNavigate, useParams } from 'react-router-dom'
import BottomNav from '../components/common/BottomNav'
import PageHeader from '../components/common/PageHeader'
import PrimaryButton from '../components/common/PrimaryButton'
import { useBooking } from '../hooks/useBooking'
import { formatCurrency } from '../utils/format'
import { useSelector } from 'react-redux'
import { selectMovieById } from '../redux/slices/movieSlice'
import { selectTheatreById, toDateOption } from '../redux/slices/scheduleSlice'

export default function BookingSummary() {
  const { movieId } = useParams()
  const navigate = useNavigate()
  const { selection, theatre, ticketsTotal, bookingFee, total } = useBooking()
  const movie = useSelector((state) => selectMovieById(state, movieId))
  const currentTheatre = useSelector((state) => selectTheatreById(state, selection.theatreId)) || theatre
  const date = selection.dateId ? toDateOption(selection.dateId) : null

  if (!movie || !currentTheatre || !date) {
    return <div className="min-h-dvh bg-app p-5 text-sm text-slate-400">Loading booking summary...</div>
  }

  return (
    <div className="relative min-h-dvh bg-app pb-[84px]">
      <PageHeader
        title="Booking Summary"
        progress={86}
        onCancel={() => navigate('/')}
      />

      <div className="px-5 pt-4">
        <img
          src={movie.ticketStill || movie.banner}
          alt={movie.title}
          className="h-[178px] w-full rounded-[14px] object-cover"
        />

        <h2 className="mt-4 text-[22px] font-bold text-ink">{movie.title}</h2>
        <div className="mt-2 flex items-center gap-4 text-[13px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <BuildingIcon />
            {currentTheatre.name}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarIcon />
            {date.label}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-4 text-[14px] font-medium text-ink">
          <span>{selection.screen}</span>
          <span>{selection.time}</span>
          <span>{selection.format}</span>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <span className="text-[14px] font-medium text-ink">Seats</span>
          {selection.seats.map((seat) => (
            <span
              key={seat}
              className="rounded-[8px] bg-slate-200 px-2.5 py-1 text-[12px] font-semibold text-slate-600"
            >
              {seat}
            </span>
          ))}
        </div>

        <div className="mt-6 space-y-2 text-[14px] text-slate-500">
          <div className="flex items-center justify-between">
            <span>{selection.seats.length}x Tickets</span>
            <span>{formatCurrency(ticketsTotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Booking Fee</span>
            <span>{formatCurrency(bookingFee)}</span>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3 text-[16px] font-bold text-ink">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>

        <div className="mt-10">
          <PrimaryButton onClick={() => navigate(`/movies/${movie.id}/checkout`)}>
            Proceed to Payment
          </PrimaryButton>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

function BuildingIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 21V7l8-4 8 4v14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9 21v-6h6v6" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
