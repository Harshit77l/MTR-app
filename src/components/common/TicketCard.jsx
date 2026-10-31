import { formatCurrency } from '../../utils/format'

export default function TicketCard({
  movie,
  theatreName,
  dateLabel,
  time,
  screen,
  format,
  seats,
  amount,
  transactionDate,
  showCancel = false,
  onCancel,
}) {
  return (
    <article className="overflow-hidden rounded-[16px] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
      <img src={movie.ticketStill || movie.banner} alt={movie.title} className="h-[168px] w-full object-cover object-center" />
      <div className="px-4 pb-4 pt-3">
        <h2 className="text-[18px] font-bold text-ink">{movie.title}</h2>
        <div className="mt-3 grid grid-cols-2 gap-y-3 text-[13px]">
          <div>
            <p className="font-medium text-ink">{theatreName}</p>
            <p className="mt-1 text-slate-400">{dateLabel}</p>
          </div>
          <div className="text-right">
            <p className="font-medium text-ink">
              {screen} - {format}
            </p>
            <p className="mt-1 text-slate-400">{time}</p>
          </div>
          <div>
            <p className="text-slate-400">Seats:</p>
            <div className="mt-1.5 flex gap-1.5">
              {seats.map((seat) => (
                <span
                  key={seat}
                  className="rounded-[8px] bg-slate-200 px-2.5 py-1 text-[12px] font-semibold text-slate-600"
                >
                  {seat}
                </span>
              ))}
            </div>
          </div>
          <div className="text-right">
            <p className="text-slate-400">Amount Paid:</p>
            <p className="mt-1.5 font-semibold text-ink">{formatCurrency(amount)}</p>
          </div>
        </div>
        <div className="mt-4 flex items-end justify-between">
          <div>
            {showCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="mb-3 rounded-full border border-rose-300 px-3 py-1 text-[12px] font-medium text-rose-500"
              >
                Cancel Booking
              </button>
            )}
            <p className="text-[12px] text-slate-400">Transaction Date:</p>
            <p className="text-[12px] text-slate-400">{transactionDate}</p>
          </div>
          <img src="/images/qr-code.png" alt="Ticket QR code" className="h-[92px] w-[92px] object-contain" />
        </div>
      </div>
    </article>
  )
}
