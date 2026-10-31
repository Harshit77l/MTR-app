import { Star } from 'lucide-react'

export default function MovieCard({ movie, onClick }) {
  const genresText = Array.isArray(movie.genres)
    ? movie.genres.join(', ')
    : Array.isArray(movie.genre)
      ? movie.genre.join(', ')
      : ''

  const rating = Number(movie.rating || 0).toFixed(1)

  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-[122px] shrink-0 text-left transition-transform duration-200 hover:scale-[1.02] focus:outline-none"
    >
      <div className="relative h-[168px] w-full overflow-hidden rounded-[16px] bg-slate-200 shadow-sm">
        <img
          src={movie.poster || movie.banner}
          alt={movie.title}
          onError={(e) => {
            e.currentTarget.src = '/images/meg2-poster.jpg'
          }}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
        <div className="absolute bottom-1.5 right-1.5 flex items-center gap-1 rounded-[4px] bg-[#09062b]/95 px-1.5 py-0.5 text-[11px] font-bold text-white shadow">
          <Star size={11} fill="#fbbf24" className="text-amber-400" />
          {rating}
        </div>
      </div>
      <h3 className="mt-2 line-clamp-2 text-[14px] font-bold leading-snug text-ink">
        {movie.title}
      </h3>
      <p className="mt-0.5 line-clamp-1 text-[12px] leading-tight text-slate-400">
        {genresText}
      </p>
    </button>
  )
}
