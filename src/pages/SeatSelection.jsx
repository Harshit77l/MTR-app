import { useNavigate, useParams } from 'react-router-dom'
import BottomNav from '../components/common/BottomNav'
import PageHeader from '../components/common/PageHeader'
import PrimaryButton from '../components/common/PrimaryButton'
import SeatLegend from '../components/seats/SeatLegend'
import SeatMap from '../components/seats/SeatMap'
import { movies } from '../data/mockData'
import { useBooking } from '../hooks/useBooking'
import { formatCurrency } from '../utils/format'

export default function SeatSelection() {
  const { movieId } = useParams()
  const navigate = useNavigate()
  const { selection, ticketsTotal, toggleSeat } = useBooking()
  const movie = movies.find((item) => item.id === movieId) || movies[0]

  return (
    <div className="relative min-h-dvh bg-app pb-[84px]">
      <PageHeader
        title="Select Seats"
        progress={70}
        onCancel={() => navigate('/')}
      />

      <div className="flex items-center justify-between px-5 pt-1 text-[13px]">
        <p className="text-slate-500">
          {selection.screen}
          <span className="ml-2 font-semibold text-brand">{selection.time}</span>
        </p>
        <p className="font-semibold text-slate-500">{formatCurrency(ticketsTotal)}</p>
      </div>

      <div className="mt-6">
        <SeatMap selectedSeats={selection.seats} onToggle={toggleSeat} />
      </div>

      <div className="mt-6 px-5">
        <SeatLegend />
        <div className="mt-5">
          <PrimaryButton
            disabled={selection.seats.length === 0}
            onClick={() => navigate(`/movies/${movie.id}/summary`)}
          >
            View Booking Summary
          </PrimaryButton>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
