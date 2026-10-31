import { useNavigate, useParams } from 'react-router-dom'
import BottomNav from '../components/common/BottomNav'
import FlowHeader from '../components/common/FlowHeader'
import PrimaryButton from '../components/common/PrimaryButton'
import ShowtimeGrid from '../components/theatres/ShowtimeGrid'
import { useBooking } from '../hooks/useBooking'
import { useSelector } from 'react-redux'
import { selectMovieById } from '../redux/slices/movieSlice'
import {
  selectShowtimes,
  selectTheatreById,
  toDateOption,
} from '../redux/slices/scheduleSlice'
import { clearSelectedSeats } from '../redux/slices/seatSlice'
import { useDispatch } from 'react-redux'

export default function Schedule() {
  const { movieId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { selection, updateSelection } = useBooking()
  const movie = useSelector((state) => selectMovieById(state, movieId))
  const theatre = useSelector((state) => selectTheatreById(state, selection.theatreId))
  const allShowtimes = useSelector(selectShowtimes)
  const activeFormat = selection.format || movie?.formats?.[0]
  const showtimes = allShowtimes.filter(
    (showtime) =>
      showtime.movieId === movieId &&
      showtime.theatreId === selection.theatreId &&
      showtime.dateId === selection.dateId &&
      showtime.format === activeFormat,
  )
  const dates = [...new Set(
    allShowtimes
      .filter((showtime) => showtime.movieId === movieId && showtime.theatreId === selection.theatreId)
      .map((showtime) => showtime.dateId),
  )].map(toDateOption)
  const date = dates.find((item) => item.id === selection.dateId) || dates[0]
  const screenBlocks = Object.values(
    showtimes.reduce((groups, showtime) => {
      groups[showtime.screen] ??= { screen: showtime.screen, times: [] }
      groups[showtime.screen].times.push(showtime.time)
      return groups
    }, {}),
  )

  if (!movie || !theatre || !date) {
    return <div className="min-h-dvh bg-app p-5 text-sm text-slate-400">Loading schedule...</div>
  }

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
              const active = activeFormat === format
              return (
                <button
                  key={format}
                  type="button"
                  onClick={() => {
                    dispatch(clearSelectedSeats())
                    updateSelection({
                      format,
                      showtimeId: null,
                      screen: null,
                      time: null,
                      ticketPrice: 0,
                      seats: [],
                    })
                  }}
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
            screens={screenBlocks}
            selected={{ screen: selection.screen, time: selection.time }}
            onSelect={(value) => {
              const showtime = showtimes.find(
                (item) => item.screen === value.screen && item.time === value.time,
              )
              dispatch(clearSelectedSeats())
              updateSelection({
                ...value,
                showtimeId: showtime.id,
                ticketPrice: showtime.ticketPrice,
                format: showtime.format,
                seats: [],
              })
            }}
          />
        </div>

        <div className="mt-8 pb-4">
          <PrimaryButton
            disabled={!selection.showtimeId || showtimes.length === 0}
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
