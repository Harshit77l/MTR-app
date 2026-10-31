import { useState } from 'react'
import { Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import MovieRow from '../components/movies/MovieRow'
import TheatreCard from '../components/theatres/TheatreCard'
import BottomNav from '../components/common/BottomNav'
import { useBooking } from '../hooks/useBooking'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMovies, selectMovies, selectMovieStatus, selectMovieError } from '../redux/slices/movieSlice'
import {
  fetchShowtimes,
  fetchTheatres,
  selectScheduleError,
  selectScheduleStatus,
  selectTheatres,
} from '../redux/slices/scheduleSlice'

export default function Home() {
  const [tab, setTab] = useState('now-showing')
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { updateSelection } = useBooking()

  const movies = useSelector(selectMovies)
  const theatres = useSelector(selectTheatres)
  const movieStatus = useSelector(selectMovieStatus)
  const movieError = useSelector(selectMovieError)
  const scheduleStatus = useSelector(selectScheduleStatus)
  const scheduleError = useSelector(selectScheduleError)

  const openMovie = (movie) => {
    updateSelection({ movieId: movie.id })
    navigate(`/movies/${movie.id}`)
  }

  // Filter movies by tab and search
  const visibleMovies = movies.filter((movie) => {
    const matchesTab = movie.status === tab
    if (!matchesTab) return false
    if (!searchQuery.trim()) return true
    return movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  })

  // Pick featured movie (Meg 2: The Trench preferred to match screenshot, or fallback)
  const featured =
    movies.find((movie) => movie.title?.toLowerCase().includes('meg 2')) ||
    movies[0] ||
    null

  const handleRetry = () => {
    dispatch(fetchMovies())
    dispatch(fetchTheatres())
    dispatch(fetchShowtimes())
  }

  if (movieStatus === 'loading' && movies.length === 0) {
    return (
      <div className="flex flex-1 min-h-[844px] flex-col items-center justify-center bg-app p-5 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent mb-3" />
        <p className="text-sm font-medium text-slate-500">Loading movies & theatres...</p>
      </div>
    )
  }

  if (movieStatus === 'failed' && movies.length === 0) {
    return (
      <div className="flex flex-1 min-h-[844px] flex-col items-center justify-center bg-app p-6 text-center">
        <p className="text-sm font-semibold text-rose-500 mb-2">Unable to load data</p>
        <p className="text-xs text-slate-400 mb-4">{movieError || scheduleError || 'Network connection error'}</p>
        <button
          type="button"
          onClick={handleRetry}
          className="rounded-lg bg-brand px-4 py-2 text-xs font-semibold text-white shadow hover:bg-brand-dark"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="relative flex-1 flex flex-col min-h-full bg-app">
      <div className="flex-1 pb-4">
        {/* Featured Banner Hero */}
        <section className="relative h-[230px] overflow-hidden bg-slate-900">
          {featured ? (
            <img
              src={featured.hero || featured.banner || '/images/meg2-hero.jpg'}
              alt={featured.title}
              className="h-full w-full object-cover object-top"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-slate-900 to-indigo-950" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

          {/* Search trigger button */}
          <button
            type="button"
            aria-label="Search"
            onClick={() => setShowSearch((prev) => !prev)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors"
          >
            <Search size={25} strokeWidth={2.4} />
          </button>

          {/* Search input dropdown when opened */}
          {showSearch && (
            <div className="absolute inset-x-4 top-16 z-20 rounded-xl bg-white/95 p-2 shadow-lg backdrop-blur-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies..."
                autoFocus
                className="w-full rounded-lg bg-slate-100 px-3 py-2 text-sm text-ink outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
          )}
        </section>

        {/* Tabs Row */}
        <div className="mt-4 flex items-end justify-between px-5">
          <div className="flex gap-6 text-[15px]">
            <button
              type="button"
              onClick={() => setTab('now-showing')}
              className={`transition-colors ${
                tab === 'now-showing' ? 'font-bold text-brand' : 'font-medium text-slate-400 hover:text-slate-600'
              }`}
            >
              <span className="relative pb-1.5 block">
                Now Showing
                {tab === 'now-showing' && (
                  <span className="absolute inset-x-0 -bottom-0.5 h-[2.5px] rounded-full bg-brand" />
                )}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setTab('coming-soon')}
              className={`transition-colors ${
                tab === 'coming-soon' ? 'font-bold text-brand' : 'font-medium text-slate-400 hover:text-slate-600'
              }`}
            >
              <span className="relative pb-1.5 block">
                Coming Soon
                {tab === 'coming-soon' && (
                  <span className="absolute inset-x-0 -bottom-0.5 h-[2.5px] rounded-full bg-brand" />
                )}
              </span>
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('')
            }}
            className="text-[13px] font-semibold text-brand hover:underline"
          >
            View All
          </button>
        </div>

        {/* Movies Row */}
        <div className="mt-3.5">
          <MovieRow movies={visibleMovies} onSelect={openMovie} />
        </div>

        {/* Movie Theatres Section Header */}
        <div className="mt-6 flex items-center justify-between px-5">
          <h2 className="text-[18px] font-bold text-ink">Movie Theatres</h2>
          <button
            type="button"
            onClick={() => {
              if (featured) {
                navigate(`/movies/${featured.id}/theatres`)
              }
            }}
            className="text-[13px] font-semibold text-brand hover:underline"
          >
            View All
          </button>
        </div>

        {/* Theatres List */}
        <div className="mt-2 px-5 space-y-1">
          {theatres.slice(0, 4).map((theatre) => (
            <TheatreCard
              key={theatre.id || theatre._id}
              theatre={theatre}
              onClick={() => {
                const targetMovie = featured || movies[0]
                if (targetMovie) {
                  updateSelection({ movieId: targetMovie.id, theatreId: theatre.id })
                  navigate(`/movies/${targetMovie.id}/schedule`)
                }
              }}
            />
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
