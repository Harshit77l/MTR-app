export default function DateSelector({ dates, selectedId, onSelect }) {
  return (
    <div className="no-scrollbar flex gap-4 overflow-x-auto px-5">
      {dates.map((date) => {
        const active = date.id === selectedId
        return (
          <button
            key={date.id}
            type="button"
            onClick={() => onSelect(date)}
            className="flex w-[42px] shrink-0 flex-col items-center"
          >
            <span className={`text-[12px] ${active ? 'font-semibold text-ink' : 'text-slate-400'}`}>
              {date.weekday}
            </span>
            <span
              className={`mt-1.5 flex h-[42px] w-[42px] items-center justify-center rounded-[12px] text-[16px] font-semibold ${
                active ? 'bg-brand text-white' : 'bg-white text-ink shadow-[0_0_0_1px_#e8eaf0]'
              }`}
            >
              {date.day}
            </span>
          </button>
        )
      })}
    </div>
  )
}
