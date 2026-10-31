import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/common/BottomNav'
import MovieCard from '../components/movies/MovieCard'
import { movies } from '../data/mockData'
import { useBooking } from '../hooks/useBooking'

export default function Favorites() {
  const { favorites, updateSelection } = useBooking()
  const navigate = useNavigate()
  const likedMovies = movies.filter((movie) => favorites.includes(movie.id))

  return (
    <div className="relative min-h-dvh bg-app pb-[84px]">
      <div className="px-5 pt-6">
        <h1 className="text-[22px] font-bold text-ink">Favorites</h1>
        {likedMovies.length === 0 ? (
          <p className="mt-10 text-center text-[14px] text-slate-400">No favorite movies yet.</p>
        ) : (
          <div className="mt-5 grid grid-cols-3 gap-3">
            {likedMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={() => {
                  updateSelection({ movieId: movie.id })
                  navigate(`/movies/${movie.id}`)
                }}
              />
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  )
}
