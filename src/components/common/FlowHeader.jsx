import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function FlowHeader({
  movie,
  theatre,
  dateLabel,
  showMeta = false,
  progress,
  onCancel,
}) {
  const navigate = useNavigate()

  return (
    <>
      <div className="relative h-[168px] overflow-hidden">
        <img
          src="/images/flow-hero.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[center_15%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/55" />
        <div className="relative z-10 flex h-full flex-col px-5 pt-5">
          <div className="flex items-center justify-between text-white">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 text-[15px] font-medium"
              aria-label="Back"
            >
              <ChevronLeft size={20} />
              Back
            </button>
            <button type="button" onClick={onCancel} className="text-[15px] font-medium">
              Cancel
            </button>
          </div>
          <div className="mt-auto pb-4">
            <h1 className="text-[22px] font-bold leading-tight text-white">{movie.title}</h1>
            {showMeta ? (
              <div className="mt-1.5 flex items-center gap-3 text-[12px] text-white/90">
                <span className="flex items-center gap-1.5">
                  <BuildingIcon />
                  {theatre.name}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarIcon />
                  {dateLabel}
                </span>
              </div>
            ) : (
              <p className="mt-1 text-[13px] text-white/85">{movie.genres.join(', ')}</p>
            )}
          </div>
        </div>
      </div>
      {typeof progress === 'number' && (
        <div className="bg-app px-5 pt-3">
          <div className="h-[5px] overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-brand" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}
    </>
  )
}

function BuildingIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 21V7l8-4 8 4v14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 21v-6h6v6" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
