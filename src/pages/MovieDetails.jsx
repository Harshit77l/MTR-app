import { Star } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import BottomNav from '../components/common/BottomNav'
import PrimaryButton from '../components/common/PrimaryButton'
import CastCard from '../components/movies/CastCard'
import { movies } from '../data/mockData'
import { useBooking } from '../hooks/useBooking'

export default function MovieDetails() {
  const { movieId } = useParams()
  const navigate = useNavigate()
  const { toggleFavorite, updateSelection } = useBooking()
  const movie = movies.find((item) => item.id === movieId) || movies[0]

  return (
    <div className="relative min-h-dvh bg-app pb-[84px]">
      <section className="relative h-[196px] overflow-hidden">
        <img src={movie.detailsHero} alt="" className="h-full w-full object-cover" />
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-0 top-0 h-14 w-24"
          aria-label="Close"
        />
        <button
          type="button"
          aria-label="Favorite"
          onClick={() => toggleFavorite(movie.id)}
          className="absolute right-0 top-0 h-14 w-16"
        />
      </section>

      <div className="px-5 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-[22px] font-bold leading-tight text-ink">{movie.title}</h1>
            <p className="mt-1 text-[13px] text-slate-400">{movie.genres.join(', ')}</p>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <span className="rounded-[6px] border border-sky-400 px-2 py-0.5 text-[11px] font-semibold text-sky-500">
              {movie.ageRating}
            </span>
            <span className="flex items-center gap-1 text-[13px] font-medium text-ink">
              <Star size={14} fill="#0f172a" className="text-ink" />
              {movie.detailRating.toFixed(1)}
            </span>
          </div>
        </div>

        <p className="mt-4 text-[13px] leading-6 text-slate-400">{movie.synopsis}</p>

        <h2 className="mt-6 text-[18px] font-bold text-ink">Format Available</h2>
        <div className="mt-3 flex gap-2.5">
          {movie.formats.map((format) => (
            <span
              key={format}
              className="rounded-[10px] border border-slate-200 bg-white px-3.5 py-1.5 text-[13px] font-medium text-slate-500"
            >
              {format}
            </span>
          ))}
        </div>

        <h2 className="mt-6 text-[18px] font-bold text-ink">Release Date</h2>
        <p className="mt-2 text-[14px] text-slate-500">{movie.releaseDate}</p>

        <h2 className="mt-6 text-[18px] font-bold text-ink">Cast</h2>
        <div className="no-scrollbar mt-3 flex gap-4 overflow-x-auto pb-2">
          {movie.cast.map((person) => (
            <CastCard key={person.id} person={person} />
          ))}
        </div>

        <div className="mt-6">
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

      <BottomNav />
    </div>
  )
}
