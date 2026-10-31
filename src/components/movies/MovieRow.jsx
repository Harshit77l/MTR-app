import MovieCard from './MovieCard'

export default function MovieRow({ movies, onSelect }) {
  return (
    <div className="no-scrollbar flex gap-3 overflow-x-auto px-5 pb-1">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} onClick={() => onSelect(movie)} />
      ))}
    </div>
  )
}
