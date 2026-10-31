import { useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/common/BottomNav'
import TicketCard from '../components/common/TicketCard'
import { movies, pastBookings } from '../data/mockData'
import { useBooking } from '../hooks/useBooking'

export default function Tickets() {
  const [tab, setTab] = useState('current')
  const navigate = useNavigate()
  const { bookings, cancelBooking } = useBooking()
  const current = bookings
  const past = pastBookings
  const list = tab === 'current' ? current : past

  return (
    <div className="relative min-h-dvh bg-app pb-[84px]">
      <div className="px-5 pt-5">
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
      </div>

      <div className="space-y-4 px-5 pt-5">
        {list.length === 0 && (
          <p className="pt-10 text-center text-[14px] text-slate-400">No bookings yet.</p>
        )}
        {list.map((booking) => {
          const movie = movies.find((item) => item.id === booking.movieId) || movies[0]
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
