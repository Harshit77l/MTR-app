import { useNavigate, useParams } from 'react-router-dom'
import BottomNav from '../components/common/BottomNav'
import FlowHeader from '../components/common/FlowHeader'
import DateSelector from '../components/theatres/DateSelector'
import TheatreCard from '../components/theatres/TheatreCard'
import { dates, movies, theatres } from '../data/mockData'
import { useBooking } from '../hooks/useBooking'

export default function SelectTheatre() {
  const { movieId } = useParams()
  const navigate = useNavigate()
  const { selection, updateSelection } = useBooking()
  const movie = movies.find((item) => item.id === movieId) || movies[0]

  return (
    <div className="relative min-h-dvh bg-app pb-[84px]">
      <FlowHeader
        movie={movie}
        progress={28}
        onCancel={() => navigate('/')}
      />

      <div className="px-5 pt-5">
        <h2 className="text-[22px] font-bold text-ink">Select Movie Theatre</h2>
      </div>

      <div className="mt-4">
        <DateSelector
          dates={dates}
          selectedId={selection.dateId}
          onSelect={(date) => updateSelection({ dateId: date.id })}
        />
      </div>

      <div className="mx-5 mt-4 border-t border-slate-200" />

      <div className="px-5 pt-2">
        {theatres.map((theatre) => (
          <TheatreCard
            key={theatre.id}
            theatre={theatre}
            onClick={() => {
              updateSelection({ movieId: movie.id, theatreId: theatre.id })
              navigate(`/movies/${movie.id}/schedule`)
            }}
          />
        ))}
      </div>

      <BottomNav />
    </div>
  )
}
