import { MapPin } from 'lucide-react'

export default function TheatreCard({ theatre, onClick }) {
  const displayLocation = [theatre.location, theatre.city].filter(Boolean).join(', ')

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3.5 py-2.5 text-left transition-colors hover:bg-slate-50/60 rounded-xl"
    >
      <div className="flex h-[64px] w-[64px] shrink-0 items-center justify-center overflow-hidden rounded-[14px] bg-[#f1f3f7] p-2 transition-transform duration-200 group-hover:scale-105">
        {theatre.logo ? (
          <img
            src={theatre.logo}
            alt={theatre.name}
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
            className="h-full w-full object-contain"
          />
        ) : (
          <span className="text-xl font-bold text-brand">{theatre.name?.[0]}</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-[15px] font-bold text-ink leading-snug">{theatre.name}</h3>
        <p className="mt-0.5 flex items-center gap-1 text-[12px] text-slate-400">
          <MapPin size={12} className="shrink-0 text-slate-400" />
          <span className="truncate">{displayLocation}</span>
        </p>
        {theatre.priceLabel && (
          <p className="mt-1 text-[13px] font-semibold text-slate-500">{theatre.priceLabel}</p>
        )}
      </div>
    </button>
  )
}
