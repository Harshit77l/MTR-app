import { useState } from 'react'
import { Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import MovieRow from '../components/movies/MovieRow'
import TheatreCard from '../components/theatres/TheatreCard'
import BottomNav from '../components/common/BottomNav'
import { useBooking } from '../hooks/useBooking'
import { useSelector } from 'react-redux'
import { selectMovies, selectMovieStatus } from '../redux/slices/movieSlice'
import {
  selectScheduleError,
  selectScheduleStatus,
  selectTheatres,
} from '../redux/slices/scheduleSlice'

export default function Home() {
  const [tab, setTab] = useState('now-showing')
  const navigate = useNavigate()
  const { updateSelection } = useBooking()
  const movies = useSelector(selectMovies)
  const theatres = useSelector(selectTheatres)
  const movieStatus = useSelector(selectMovieStatus)
  const scheduleStatus = useSelector(selectScheduleStatus)
  const scheduleError = useSelector(selectScheduleError)
  const visibleMovies = movies.filter((movie) => movie.status === tab)
  const featured = movies.find((movie) => movie.title === 'Meg 2: The Trench') || movies[0]

  const openMovie = (movie) => {
    updateSelection({ movieId: movie.id })
    navigate(`/movies/${movie.id}`)
  }

  if (movieStatus === 'loading' || scheduleStatus === 'loading' || !featured) {
    return <div className="min-h-dvh bg-app p-5 text-sm text-slate-400">Loading movies...</div>
  }

  if (movieStatus === 'failed' || scheduleStatus === 'failed') {
    return <div className="min-h-dvh bg-app p-5 text-sm text-rose-500">{scheduleError || 'Unable to load movies.'}</div>
  }

  return (
    <div className="relative min-h-dvh bg-app pb-[84px]">
      <section className="relative h-[220px] overflow-hidden">
        <img src={featured.hero} alt={featured.title} className="h-full w-full object-cover" />
        <button
          type="button"
          aria-label="Search"
          className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center text-white"
        >
          <Search size={27} strokeWidth={2.2} />
        </button>
      </section>

      <div className="mt-4 flex items-end justify-between px-5">
        <div className="flex gap-6 text-[15px]">
          <button
            type="button"
            onClick={() => setTab('now-showing')}
            className={tab === 'now-showing' ? 'font-semibold text-brand' : 'text-slate-400'}
          >
            <span className="relative pb-1.5">
              Now Showing
              {tab === 'now-showing' && (
                <span className="absolute inset-x-0 -bottom-0.5 h-[2px] rounded-full bg-brand" />
              )}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setTab('coming-soon')}
            className={tab === 'coming-soon' ? 'font-semibold text-brand' : 'text-slate-400'}
          >
            Coming Soon
          </button>
        </div>
        <button type="button" className="text-[13px] font-medium text-brand">
          View All
        </button>
      </div>

      <div className="mt-4">
        <MovieRow movies={visibleMovies} onSelect={openMovie} />
      </div>

      <div className="mt-6 flex items-center justify-between px-5">
        <h2 className="text-[18px] font-bold text-ink">Movie Theatres</h2>
        <button
          type="button"
          onClick={() => navigate(`/movies/${featured.id}/theatres`)}
          className="text-[13px] font-medium text-brand"
        >
          View All
        </button>
      </div>

      <div className="mt-2 px-5">
        {theatres.slice(0, 3).map((theatre) => (
          <TheatreCard
            key={theatre.id}
            theatre={theatre}
            onClick={() => {
              updateSelection({ movieId: featured.id, theatreId: theatre.id })
              navigate(`/movies/${featured.id}/schedule`)
            }}
          />
        ))}
      </div>

      <BottomNav />
    </div>
  )
}
