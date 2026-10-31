import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BottomNav from '../components/common/BottomNav'
import PageHeader from '../components/common/PageHeader'
import PrimaryButton from '../components/common/PrimaryButton'
import { useBooking } from '../hooks/useBooking'
import { formatCurrency } from '../utils/format'
import { useSelector } from 'react-redux'
import { selectMovieById } from '../redux/slices/movieSlice'
import { selectTheatreById, toDateOption } from '../redux/slices/scheduleSlice'

export default function Checkout() {
  const { movieId } = useParams()
  const navigate = useNavigate()
  const { selection, ticketsTotal, bookingFee, total, confirmBooking, bookingStatus, bookingError } = useBooking()
  const movie = useSelector((state) => selectMovieById(state, movieId))
  const theatre = useSelector((state) => selectTheatreById(state, selection.theatreId))
  const date = selection.dateId ? toDateOption(selection.dateId) : null
  const [method, setMethod] = useState('card')
  const [saveDetails, setSaveDetails] = useState(false)
  const [form, setForm] = useState({
    name: '',
    number: '',
    expiry: '',
    cvc: '',
  })

  const handlePay = async () => {
    try {
      const booking = await confirmBooking({
        showtimeId: selection.showtimeId,
        selectedSeats: selection.seats,
      }).unwrap()
      navigate(`/movies/${movie.id}/success`, { state: { bookingId: booking.id } })
    } catch (error) {
      console.error(`Booking failed: ${error.message}`)
    }
  }

  if (!movie) {
    return <div className="flex flex-1 min-h-[844px] items-center justify-center bg-app p-5 text-sm text-slate-400">Loading checkout...</div>
  }

  if (!theatre || !date || selection.seats.length === 0) {
    return (
      <div className="relative flex-1 flex flex-col min-h-full bg-app">
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <p className="text-base font-bold text-ink">No active seat selection</p>
          <p className="mt-1 text-sm text-slate-400">Please choose a showtime and seats first.</p>
          <button
            type="button"
            onClick={() => navigate(`/movies/${movieId}/theatres`)}
            className="mt-4 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white shadow hover:bg-brand-dark"
          >
            View Theatres & Schedule
          </button>
        </div>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="relative flex-1 flex flex-col min-h-full bg-app">
      <div className="flex-1 pb-6">
        <PageHeader title="Checkout" progress={100} onCancel={() => navigate('/')} />

        <div className="px-5 pt-5">
          <h2 className="text-[18px] font-bold text-ink">Summary</h2>
          <div className="mt-3 space-y-2 text-[14px] text-slate-500">
            <div className="flex justify-between">
              <span>{selection.seats.length}x Tickets</span>
              <span>{formatCurrency(ticketsTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Booking Fee</span>
              <span>{formatCurrency(bookingFee)}</span>
            </div>
          </div>
          <div className="mt-3 flex justify-between border-t border-slate-200 pt-3 text-[16px] font-bold text-ink">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>

          <h2 className="mt-7 text-[18px] font-bold text-ink">Choose payment method</h2>
          <div className="mt-4 flex items-center gap-6 text-[14px] text-ink">
            <MethodOption
              active={method === 'card'}
              label="Credit/Debit Card"
              onClick={() => setMethod('card')}
            />
            <MethodOption
              active={method === 'wallet'}
              label="Mobile Wallet"
              onClick={() => setMethod('wallet')}
            />
          </div>

          {method === 'card' && (
            <div className="mt-5 space-y-4">
              <Field
                label="Name on card"
                placeholder="Name on card"
                value={form.name}
                onChange={(value) => setForm((current) => ({ ...current, name: value }))}
              />
              <Field
                label="Card number"
                placeholder="1234 5678 9012 3456"
                value={form.number}
                onChange={(value) => setForm((current) => ({ ...current, number: value }))}
              />
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Expiry date"
                  placeholder="MM/YY"
                  value={form.expiry}
                  onChange={(value) => setForm((current) => ({ ...current, expiry: value }))}
                />
                <Field
                  label="CVC/CVV"
                  placeholder="CVC"
                  value={form.cvc}
                  onChange={(value) => setForm((current) => ({ ...current, cvc: value }))}
                />
              </div>
              <label className="flex items-center gap-2 text-[13px] text-slate-500 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={saveDetails}
                  onChange={(event) => setSaveDetails(event.target.checked)}
                  className="accent-brand h-4 w-4 rounded"
                />
                Save payment details for the next purchase
              </label>
            </div>
          )}

          {method === 'wallet' && (
            <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4 text-[13px] text-slate-500">
              <p className="font-semibold text-ink mb-1">Mobile Wallet Selected</p>
              You will confirm this purchase directly via your linked digital wallet at checkout completion.
            </div>
          )}

          <div className="mt-8">
            {bookingError && <p className="mb-3 text-sm text-rose-500 font-medium">{bookingError}</p>}
            <PrimaryButton disabled={bookingStatus === 'loading'} onClick={handlePay}>
              {bookingStatus === 'loading' ? 'Processing Payment...' : 'Complete Payment'}
            </PrimaryButton>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

function MethodOption({ active, label, onClick }) {
  return (
    <button type="button" onClick={onClick} className="flex items-center gap-2 focus:outline-none">
      <span
        className={`flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 transition-colors ${
          active ? 'border-brand' : 'border-slate-300'
        }`}
      >
        {active && <span className="h-2.5 w-2.5 rounded-full bg-brand" />}
      </span>
      <span className={active ? 'font-semibold text-ink' : 'text-slate-600'}>{label}</span>
    </button>
  )
}

function Field({ label, placeholder, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-ink">{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-[44px] w-full rounded-[10px] border border-slate-200 bg-white px-3 text-[14px] text-ink outline-none placeholder:text-slate-300 focus:border-brand transition-colors"
      />
    </label>
  )
}
