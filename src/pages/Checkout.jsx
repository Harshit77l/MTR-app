import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BottomNav from '../components/common/BottomNav'
import PageHeader from '../components/common/PageHeader'
import PrimaryButton from '../components/common/PrimaryButton'
import { dates, movies, theatres } from '../data/mockData'
import { useBooking } from '../hooks/useBooking'
import { formatCurrency } from '../utils/format'

export default function Checkout() {
  const { movieId } = useParams()
  const navigate = useNavigate()
  const { selection, ticketsTotal, bookingFee, total, confirmBooking } = useBooking()
  const movie = movies.find((item) => item.id === movieId) || movies[0]
  const theatre = theatres.find((item) => item.id === selection.theatreId) || theatres[0]
  const date = dates.find((item) => item.id === selection.dateId) || dates[0]
  const [method, setMethod] = useState('card')
  const [saveDetails, setSaveDetails] = useState(false)
  const [form, setForm] = useState({
    name: '',
    number: '',
    expiry: '',
    cvc: '',
  })

  const handlePay = () => {
    const booking = confirmBooking({
      movieId: movie.id,
      theatreName: theatre.name,
      dateLabel: date.label,
      time: selection.time,
      screen: selection.screen,
      format: selection.format,
      seats: selection.seats,
      amount: total,
      transactionDate: '10/9/2023 10:45 AM',
    })
    navigate(`/movies/${movie.id}/success`, { state: { bookingId: booking.id } })
  }

  return (
    <div className="relative min-h-dvh bg-app pb-[84px]">
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
            <label className="flex items-center gap-2 text-[13px] text-slate-500">
              <input
                type="checkbox"
                checked={saveDetails}
                onChange={(event) => setSaveDetails(event.target.checked)}
                className="accent-brand"
              />
              Save payment details for the next purchase
            </label>
          </div>
        )}

        {method === 'wallet' && (
          <p className="mt-5 text-[13px] text-slate-400">
            You will confirm this purchase with your linked mobile wallet.
          </p>
        )}

        <div className="mt-8">
          <PrimaryButton onClick={handlePay}>Complete Payment</PrimaryButton>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

function MethodOption({ active, label, onClick }) {
  return (
    <button type="button" onClick={onClick} className="flex items-center gap-2">
      <span
        className={`flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 ${
          active ? 'border-brand' : 'border-brand/70'
        }`}
      >
        {active && <span className="h-2.5 w-2.5 rounded-full bg-brand" />}
      </span>
      {label}
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
        className="h-[44px] w-full rounded-[10px] border border-slate-200 bg-white px-3 text-[14px] outline-none placeholder:text-slate-300 focus:border-brand"
      />
    </label>
  )
}
