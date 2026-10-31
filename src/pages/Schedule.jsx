import { useNavigate, useParams } from 'react-router-dom'
import BottomNav from '../components/common/BottomNav'
import FlowHeader from '../components/common/FlowHeader'
import PrimaryButton from '../components/common/PrimaryButton'
import ShowtimeGrid from '../components/theatres/ShowtimeGrid'
import { useBooking } from '../hooks/useBooking'
import { useSelector, useDispatch } from 'react-redux'
import { selectMovieById } from '../redux/slices/movieSlice'
import {
  selectShowtimes,
  selectTheatreById,
  toDateOption,
} from '../redux/slices/scheduleSlice'
import { clearSelectedSeats } from '../redux/slices/seatSlice'

export default function Schedule() {
  const { movieId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { selection, updateSelection } = useBooking()
  const movie = useSelector((state) => selectMovieById(state, movieId))
  const theatre = useSelector((state) => selectTheatreById(state, selection.theatreId))
  const allShowtimes = useSelector(selectShowtimes)

  const activeFormat = selection.format || movie?.formats?.[0] || '2D'

  const availableDates = [...new Set(
    allShowtimes
      .filter((showtime) => showtime.movieId === movieId && showtime.theatreId === selection.theatreId)
      .map((showtime) => showtime.dateId),
  )].map(toDateOption)

  const activeDateId = selection.dateId || availableDates[0]?.id
  const date = availableDates.find((item) => item.id === activeDateId) || availableDates[0]

  const showtimes = allShowtimes.filter(
    (showtime) =>
      showtime.movieId === movieId &&
      showtime.theatreId === selection.theatreId &&
      showtime.dateId === activeDateId &&
      showtime.format === activeFormat,
  )

  const screenBlocks = Object.values(
    showtimes.reduce((groups, showtime) => {
      groups[showtime.screen] ??= { screen: showtime.screen, times: [] }
      groups[showtime.screen].times.push(showtime.time)
      return groups
    }, {}),
  )

  if (!movie || !theatre) {
    return <div className="flex flex-1 min-h-[844px] items-center justify-center bg-app p-5 text-sm text-slate-400">Loading schedule...</div>
  }

  if (availableDates.length === 0) {
    return (
      <div className="relative flex-1 flex flex-col min-h-full bg-app">
        <div className="flex-1 p-6">
          <h2 className="text-xl font-bold text-ink">No Shows Found</h2>
          <p className="mt-2 text-sm text-slate-500">
            There are no scheduled showtimes for {theatre.name}.
          </p>
          <button
            type="button"
            onClick={() => navigate(`/movies/${movieId}/theatres`)}
            className="mt-4 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white"
          >
            Choose another theatre
          </button>
        </div>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="relative flex-1 flex flex-col min-h-full bg-app">
      <div className="flex-1 pb-6">
        <FlowHeader
          movie={movie}
          theatre={theatre}
          dateLabel={date?.label || ''}
          showMeta
          progress={52}
          onCancel={() => navigate('/')}
        />

        <div className="px-5 pt-5">
          <h2 className="text-[22px] font-bold text-ink">Choose Schedule</h2>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-[14px] font-semibold text-ink">Format</span>
              {(movie.formats || ['2D', '3D']).map((format) => {
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
                    className={`h-[32px] min-w-[44px] rounded-[10px] px-3 text-[13px] font-semibold transition-all ${
                      active ? 'bg-brand text-white shadow-sm' : 'border border-slate-200 bg-white text-slate-500'
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
            {screenBlocks.length === 0 ? (
              <p className="py-12 text-center text-sm text-slate-400">
                No {activeFormat} shows available on this date.
              </p>
            ) : (
              <ShowtimeGrid
                screens={screenBlocks}
                selected={{ screen: selection.screen, time: selection.time }}
                onSelect={(value) => {
                  const showtime = showtimes.find(
                    (item) => item.screen === value.screen && item.time === value.time,
                  )
                  if (showtime) {
                    dispatch(clearSelectedSeats())
                    updateSelection({
                      ...value,
                      showtimeId: showtime.id,
                      ticketPrice: showtime.ticketPrice,
                      format: showtime.format,
                      seats: [],
                    })
                  }
                }}
              />
            )}
          </div>

          <div className="mt-8">
            <PrimaryButton
              disabled={!selection.showtimeId || showtimes.length === 0}
              onClick={() => navigate(`/movies/${movie.id}/seats`)}
            >
              Get Tickets
            </PrimaryButton>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
