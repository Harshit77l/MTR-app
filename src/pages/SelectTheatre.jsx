import { useNavigate, useParams } from 'react-router-dom'
import BottomNav from '../components/common/BottomNav'
import FlowHeader from '../components/common/FlowHeader'
import DateSelector from '../components/theatres/DateSelector'
import TheatreCard from '../components/theatres/TheatreCard'
import { useBooking } from '../hooks/useBooking'
import { useSelector } from 'react-redux'
import { selectMovieById } from '../redux/slices/movieSlice'
import {
  selectScheduleStatus,
  selectShowtimes,
  selectTheatres,
  toDateOption,
} from '../redux/slices/scheduleSlice'

export default function SelectTheatre() {
  const { movieId } = useParams()
  const navigate = useNavigate()
  const { selection, updateSelection } = useBooking()
  const movie = useSelector((state) => selectMovieById(state, movieId))
  const theatres = useSelector(selectTheatres)
  const showtimes = useSelector(selectShowtimes)
  const scheduleStatus = useSelector(selectScheduleStatus)

  const movieShowtimes = showtimes.filter((showtime) => showtime.movieId === movieId)
  const dates = [...new Set(movieShowtimes.map((showtime) => showtime.dateId))].map(toDateOption)

  if (!movie || scheduleStatus === 'loading') {
    return <div className="flex flex-1 min-h-[844px] items-center justify-center bg-app p-5 text-sm text-slate-400">Loading theatres...</div>
  }

  const matchingTheatres = theatres.filter((theatre) =>
    movieShowtimes.some((showtime) => showtime.theatreId === theatre.id),
  )

  return (
    <div className="relative flex-1 flex flex-col min-h-full bg-app">
      <div className="flex-1 pb-6">
        <FlowHeader
          movie={movie}
          progress={28}
          onCancel={() => navigate('/')}
        />

        <div className="px-5 pt-5">
          <h2 className="text-[22px] font-bold text-ink">Select Movie Theatre</h2>
        </div>

        {dates.length > 0 && (
          <div className="mt-4">
            <DateSelector
              dates={dates}
              selectedId={selection.dateId || dates[0]?.id}
              onSelect={(date) => updateSelection({ dateId: date.id })}
            />
          </div>
        )}

        <div className="mx-5 mt-4 border-t border-slate-200" />

        <div className="px-5 pt-2">
          {matchingTheatres.length === 0 ? (
            <p className="py-16 text-center text-sm text-slate-400">
              No theatres or showtimes currently scheduled for this movie.
            </p>
          ) : (
            matchingTheatres.map((theatre) => (
              <TheatreCard
                key={theatre.id}
                theatre={theatre}
                onClick={() => {
                  updateSelection({
                    movieId: movie.id,
                    theatreId: theatre.id,
                    dateId: dates.some((date) => date.id === selection.dateId)
                      ? selection.dateId
                      : dates[0]?.id,
                    format: selection.format || movie.formats?.[0] || '2D',
                  })
                  navigate(`/movies/${movie.id}/schedule`)
                }}
              />
            ))
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
