import { Star } from 'lucide-react'

export default function MovieCard({ movie, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-[116px] shrink-0 text-left"
    >
      <div className="relative h-[158px] overflow-hidden rounded-[14px] bg-slate-200">
        <img src={movie.poster} alt={movie.title} className="h-full w-full object-cover" />
        <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-2 right-1 flex items-center gap-1 rounded-[4px] bg-[#08052d] px-1.5 py-1 text-[11px] font-semibold text-white">
          <Star size={11} fill="#fbbf24" className="text-amber-400" />
          {movie.rating.toFixed(1)}
        </div>
      </div>
      <h3 className="mt-2 line-clamp-2 text-[14px] font-semibold leading-tight text-ink">
        {movie.title}
      </h3>
      <p className="mt-0.5 line-clamp-2 text-[12px] leading-snug text-slate-400">
        {movie.genres.join(', ')}
      </p>
    </button>
  )
}
