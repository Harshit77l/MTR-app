import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ProgressBar from './ProgressBar'

export default function PageHeader({
  title,
  onCancel,
  progress,
  showProgress = true,
}) {
  const navigate = useNavigate()

  return (
    <div className="bg-app px-5 pt-5">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-[15px] font-medium text-slate-800"
          aria-label="Back"
        >
          <ChevronLeft size={20} />
          Back
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="text-[15px] text-slate-400">
            Cancel
          </button>
        )}
      </div>
      {showProgress && (
        <div className="mt-4">
          <ProgressBar value={progress} />
        </div>
      )}
      {title && <h1 className="mt-4 text-[22px] font-bold text-ink">{title}</h1>}
    </div>
  )
}
