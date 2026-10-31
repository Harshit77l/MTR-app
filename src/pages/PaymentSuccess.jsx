import { CircleCheck } from 'lucide-react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import BottomNav from '../components/common/BottomNav'
import TicketCard from '../components/common/TicketCard'
import { movies } from '../data/mockData'
import { useBooking } from '../hooks/useBooking'

export default function PaymentSuccess() {
  const { movieId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { bookings, selection, theatre, total } = useBooking()
  const movie = movies.find((item) => item.id === movieId) || movies[0]
  const booking =
    bookings.find((item) => item.id === location.state?.bookingId) || bookings[0] || {
      theatreName: theatre.name,
      dateLabel: 'Friday, October 10',
      time: selection.time,
      screen: selection.screen,
      format: selection.format,
      seats: selection.seats,
      amount: total,
      transactionDate: '10/9/2023 10:45 AM',
    }

  return (
    <div className="relative min-h-dvh bg-app pb-[84px]">
      <div className="flex justify-end px-5 pt-5">
        <button type="button" onClick={() => navigate('/')} className="text-[15px] text-slate-400">
          Close
        </button>
      </div>

      <div className="mt-4 flex flex-col items-center">
        <CircleCheck size={42} className="text-emerald-400" strokeWidth={2.4} />
        <p className="mt-3 text-[16px] text-slate-400">Payment Successful!</p>
      </div>

      <div className="px-5 pt-5">
        <TicketCard
          movie={movie}
          theatreName={booking.theatreName}
          dateLabel={booking.dateLabel}
          time={booking.time}
          screen={booking.screen}
          format={booking.format}
          seats={booking.seats}
          amount={booking.amount}
          transactionDate={booking.transactionDate}
        />
        <p className="mt-5 text-center text-[13px] leading-5 text-slate-400">
          You may view all purchased tickets in the ticket page.
        </p>
      </div>

      <BottomNav />
    </div>
  )
}
