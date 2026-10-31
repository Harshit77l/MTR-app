export default function CastCard({ person }) {
  return (
    <div className="flex w-[168px] shrink-0 items-center gap-2.5">
      <img
        src={person.photo}
        alt={person.name}
        className="h-[52px] w-[52px] rounded-[10px] object-cover"
      />
      <div className="min-w-0">
        <p className="truncate text-[14px] font-semibold leading-tight text-ink">{person.name}</p>
        <p className="mt-0.5 truncate text-[12px] text-slate-400">{person.role}</p>
      </div>
    </div>
  )
}
