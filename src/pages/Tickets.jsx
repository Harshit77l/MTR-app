import { useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/common/BottomNav'
import TicketCard from '../components/common/TicketCard'
import { useBooking } from '../hooks/useBooking'
import { useSelector } from 'react-redux'
import { selectMovies } from '../redux/slices/movieSlice'

export default function Tickets() {
  const [tab, setTab] = useState('current')
  const navigate = useNavigate()
  const { bookings, cancelBooking, bookingError } = useBooking()
  const movies = useSelector(selectMovies)
  const current = bookings.filter((booking) => booking.status === 'confirmed')
  const past = bookings.filter((booking) => booking.status === 'cancelled')
  const list = tab === 'current' ? current : past

  return (
    <div className="relative flex-1 flex flex-col min-h-full bg-app">
      <div className="flex-1 px-5 pt-5 pb-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-[15px] font-medium text-slate-800"
        >
          <ChevronLeft size={20} />
          Back
        </button>

        <div className="mt-5 flex gap-6 text-[15px]">
          <TabButton active={tab === 'current'} onClick={() => setTab('current')}>
            My Bookings
          </TabButton>
          <TabButton active={tab === 'past'} onClick={() => setTab('past')}>
            Past Bookings
          </TabButton>
        </div>

        <div className="mt-5 space-y-4">
          {bookingError && <p className="text-sm text-rose-500">{bookingError}</p>}
          {list.length === 0 && (
            <p className="pt-16 text-center text-[14px] text-slate-400">
              {tab === 'current' ? 'No active bookings yet.' : 'No past bookings found.'}
            </p>
          )}
          {list.map((booking) => {
            const movie = movies.find((item) => item.id === booking.movieId) || booking.movie
            if (!movie) return null
            return (
              <TicketCard
                key={booking.id}
                movie={movie}
                theatreName={booking.theatreName}
                dateLabel={booking.dateLabel}
                time={booking.time}
                screen={booking.screen}
                format={booking.format}
                seats={booking.seats}
                amount={booking.amount}
                transactionDate={booking.transactionDate}
                showCancel={tab === 'current'}
                onCancel={() => cancelBooking(booking.id)}
              />
            )
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

function TabButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={active ? 'font-semibold text-brand' : 'text-slate-400'}
    >
      <span className="relative pb-1.5">
        {children}
        {active && <span className="absolute inset-x-0 -bottom-0.5 h-[2px] rounded-full bg-brand" />}
      </span>
    </button>
  )
}
