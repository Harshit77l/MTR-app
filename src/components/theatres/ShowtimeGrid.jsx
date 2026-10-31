export default function ShowtimeGrid({ screens, selected, onSelect }) {
  return (
    <div className="space-y-6">
      {screens.map((block) => (
        <section key={block.screen}>
          <h3 className="mb-3 text-[16px] font-semibold text-ink">{block.screen}</h3>
          <div className="grid grid-cols-3 gap-2.5">
            {block.times.map((time) => {
              const active = selected.screen === block.screen && selected.time === time
              return (
                <button
                  key={`${block.screen}-${time}`}
                  type="button"
                  onClick={() => onSelect({ screen: block.screen, time })}
                  className={`h-[36px] rounded-[10px] text-[13px] font-medium ${
                    active
                      ? 'bg-brand text-white'
                      : 'border border-slate-200 bg-white text-slate-500'
                  }`}
                >
                  {time}
                </button>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
