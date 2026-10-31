export default function ProgressBar({ value }) {
  return (
    <div className="h-[6px] w-full overflow-hidden rounded-full bg-slate-200">
      <div
        className="h-full rounded-full bg-brand transition-[width] duration-200"
        style={{ width: `${value}%` }}
      />
    </div>
  )
}
