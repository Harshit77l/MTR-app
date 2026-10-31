import { useNavigate, useParams } from 'react-router-dom'
import BottomNav from '../components/common/BottomNav'
import FlowHeader from '../components/common/FlowHeader'
import PrimaryButton from '../components/common/PrimaryButton'
import ShowtimeGrid from '../components/theatres/ShowtimeGrid'
import { dates, movies, showtimes, theatres } from '../data/mockData'
import { useBooking } from '../hooks/useBooking'

export default function Schedule() {
  const { movieId } = useParams()
  const navigate = useNavigate()
  const { selection, updateSelection } = useBooking()
  const movie = movies.find((item) => item.id === movieId) || movies[0]
  const theatre = theatres.find((item) => item.id === selection.theatreId) || theatres[0]
  const date = dates.find((item) => item.id === selection.dateId) || dates[0]

  return (
    <div className="relative min-h-dvh bg-app pb-[84px]">
      <FlowHeader
        movie={movie}
        theatre={theatre}
        dateLabel={date.label}
        showMeta
        progress={52}
        onCancel={() => navigate('/')}
      />

      <div className="px-5 pt-5">
        <h2 className="text-[22px] font-bold text-ink">Choose Schedule</h2>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-[14px] font-semibold text-ink">Format</span>
            {movie.formats.map((format) => {
              const active = selection.format === format
              return (
                <button
                  key={format}
                  type="button"
                  onClick={() => updateSelection({ format })}
                  className={`h-[32px] min-w-[44px] rounded-[10px] px-3 text-[13px] font-semibold ${
                    active ? 'bg-brand text-white' : 'border border-slate-200 bg-white text-slate-500'
                  }`}
                >
                  {format}
                </button>
              )
            })}
          </div>
          <span className="text-[13px] font-semibold text-slate-400">{theatre.priceLabel}</span>
        </div>

        <div className="mt-6">
          <ShowtimeGrid
            screens={showtimes}
            selected={{ screen: selection.screen, time: selection.time }}
            onSelect={(value) => updateSelection(value)}
          />
        </div>

        <div className="mt-8 pb-4">
          <PrimaryButton
            onClick={() => navigate(`/movies/${movie.id}/seats`)}
          >
            Get Tickets
          </PrimaryButton>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
