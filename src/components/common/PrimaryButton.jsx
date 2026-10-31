export default function PrimaryButton({ children, disabled, className = '', ...props }) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`h-[48px] w-full rounded-[12px] bg-brand text-[15px] font-semibold text-white transition-opacity duration-200 disabled:opacity-40 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
