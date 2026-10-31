import MovieCard from './MovieCard'

export default function MovieRow({ movies, onSelect }) {
  if (!movies || movies.length === 0) {
    return (
      <div className="px-5 py-6 text-center text-sm text-slate-400">
        No movies available in this category.
      </div>
    )
  }

  return (
    <div className="no-scrollbar flex gap-3.5 overflow-x-auto scroll-smooth px-5 pb-2 pt-1">
      {movies.map((movie) => (
        <MovieCard key={movie.id || movie._id} movie={movie} onClick={() => onSelect(movie)} />
      ))}
    </div>
  )
}
