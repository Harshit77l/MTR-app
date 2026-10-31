import { Heart, Star } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import BottomNav from '../components/common/BottomNav'
import PrimaryButton from '../components/common/PrimaryButton'
import CastCard from '../components/movies/CastCard'
import { useBooking } from '../hooks/useBooking'
import { useSelector } from 'react-redux'
import { selectMovieById } from '../redux/slices/movieSlice'

export default function MovieDetails() {
  const { movieId } = useParams()
  const navigate = useNavigate()
  const { toggleFavorite, updateSelection, favorites } = useBooking()
  const movie = useSelector((state) => selectMovieById(state, movieId))
  const isFavorite = favorites?.includes(movie?.id)

  if (!movie) {
    return <div className="flex flex-1 min-h-[844px] items-center justify-center bg-app p-5 text-sm text-slate-400">Loading movie...</div>
  }

  return (
    <div className="relative flex-1 flex flex-col min-h-full bg-app">
      <div className="flex-1 pb-6">
        <section className="relative h-[210px] overflow-hidden">
          <img
            src={movie.detailsHero || movie.banner || movie.poster}
            alt={movie.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 pt-4 bg-gradient-to-b from-black/70 to-transparent">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-[16px] font-medium text-white hover:opacity-80 transition-opacity"
            >
              Close
            </button>
            <button
              type="button"
              aria-label="Favorite"
              onClick={() => toggleFavorite(movie.id)}
              className="flex items-center justify-center text-white hover:opacity-80 transition-opacity"
            >
              <Heart
                size={24}
                strokeWidth={2}
                className={isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white'}
              />
            </button>
          </div>
        </section>

        <div className="px-5 pt-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-[22px] font-bold leading-tight text-ink">{movie.title}</h1>
              <p className="mt-1 text-[13px] text-slate-400">
                {Array.isArray(movie.genres) ? movie.genres.join(', ') : movie.genre?.join(', ') || ''}
              </p>
            </div>
            <div className="flex items-center gap-2 pt-1 shrink-0">
              <span className="rounded-[6px] border border-sky-400 px-2 py-0.5 text-[11px] font-semibold text-sky-500">
                {movie.ageRating || 'PG-13'}
              </span>
              <span className="flex items-center gap-1 text-[13px] font-medium text-ink">
                <Star size={14} fill="#0f172a" className="text-ink" />
                {(movie.detailRating || movie.rating || 0).toFixed(1)}
              </span>
            </div>
          </div>

          <p className="mt-4 text-[13px] leading-6 text-slate-500">
            {movie.synopsis || movie.description}
          </p>

          <h2 className="mt-6 text-[18px] font-bold text-ink">Format Available</h2>
          <div className="mt-3 flex gap-2.5">
            {(movie.formats || ['2D']).map((format) => (
              <span
                key={format}
                className="rounded-[6px] border border-slate-300 bg-transparent px-3.5 py-1.5 text-[13px] font-medium text-brand"
              >
                {format}
              </span>
            ))}
          </div>

          <h2 className="mt-6 text-[18px] font-bold text-ink">Release Date</h2>
          <p className="mt-2 text-[14px] text-slate-500">
            {movie.releaseDateLabel || (movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '')}
          </p>

          {Array.isArray(movie.cast) && movie.cast.length > 0 && (
            <>
              <h2 className="mt-6 text-[18px] font-bold text-ink">Cast</h2>
              <div className="no-scrollbar mt-3 flex gap-4 overflow-x-auto pb-2">
                {movie.cast.map((person) => (
                  <CastCard key={person.name} person={person} />
                ))}
              </div>
            </>
          )}

          <div className="mt-8">
            <PrimaryButton
              onClick={() => {
                updateSelection({ movieId: movie.id })
                navigate(`/movies/${movie.id}/theatres`)
              }}
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
