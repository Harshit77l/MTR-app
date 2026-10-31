export default function SeatLegend() {
  const items = [
    { label: 'Available', className: 'border border-slate-300 bg-white' },
    { label: 'Occupied', className: 'bg-slate-400' },
    { label: 'Selected', className: 'bg-brand' },
  ]

  return (
    <div className="flex items-center justify-center gap-5 text-[12px] text-slate-500">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span className={`h-3.5 w-3.5 rounded-[3px] ${item.className}`} />
          {item.label}
        </div>
      ))}
    </div>
  )
}
