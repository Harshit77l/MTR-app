import { MapPin } from 'lucide-react'

export default function TheatreCard({ theatre, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3.5 py-2.5 text-left"
    >
      <div
        className="flex h-[64px] w-[64px] shrink-0 items-center justify-center overflow-hidden rounded-[14px]"
        style={{ background: theatre.logoBg }}
      >
        <img src={theatre.logo} alt="" className="h-full w-full object-contain" />
      </div>
      <div className="min-w-0">
        <h3 className="text-[15px] font-semibold text-ink">{theatre.name}</h3>
        <p className="mt-0.5 flex items-center gap-1 text-[12px] text-slate-400">
          <MapPin size={12} className="shrink-0" />
          <span className="truncate">{theatre.location}</span>
        </p>
        <p className="mt-1 text-[13px] font-semibold text-slate-500">{theatre.priceLabel}</p>
      </div>
    </button>
  )
}
