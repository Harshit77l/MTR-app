import { getSeatLabel } from '../../utils/format'

export default function SeatMap({ seats, selectedSeats, onToggle }) {
  const rows = [...new Set(seats.map((seat) => seat.row))]

  return (
    <div className="no-scrollbar overflow-x-auto">
      <div className="w-[430px] px-4">
        <div className="mb-5">
          <div className="screen-curve" />
          <p className="mt-2 text-center text-[11px] tracking-[0.28em] text-slate-400">SCREEN</p>
        </div>
        <div className="space-y-2">
          {rows.map((row, index) => {
            const rowSeats = seats.filter((seat) => seat.row === row)
            return (
            <div key={row} className={`flex items-center gap-1.5 ${index === 8 ? 'mt-5' : ''}`}>
              <span className="w-4 text-[12px] font-medium text-slate-500">{row}</span>
              <div className="flex flex-1 justify-center gap-[5px]">
                {rowSeats.map((seat) => {
                  const number = seat.column
                  const id = seat.seatNumber || getSeatLabel(row, number)
                  const occupied = seat.status === 'occupied'
                  const selected = selectedSeats.includes(id)
                  return (
                    <button
                      key={id}
                      type="button"
                      disabled={occupied}
                      onClick={() => onToggle(id)}
                      aria-label={`Seat ${id}`}
                      className={`h-[26px] w-[26px] rounded-[6px] text-[10px] font-medium ${
                        occupied
                          ? 'bg-slate-400 text-white'
                          : selected
                            ? 'bg-brand text-white'
                            : 'border border-slate-200 bg-white text-slate-500'
                      }`}
                    >
                      {number}
                    </button>
                  )
                })}
              </div>
            </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
