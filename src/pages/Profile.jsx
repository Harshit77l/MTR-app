import { UserRound } from 'lucide-react'
import BottomNav from '../components/common/BottomNav'

export default function Profile() {
  return (
    <div className="relative min-h-dvh bg-app pb-[84px]">
      <div className="px-5 pt-6">
        <h1 className="text-[22px] font-bold text-ink">Profile</h1>
        <div className="mt-8 flex flex-col items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-brand shadow-sm">
            <UserRound size={36} />
          </div>
          <p className="mt-4 text-[16px] font-semibold text-ink">Guest User</p>
          <p className="mt-1 text-[13px] text-slate-400">Sign in later to sync bookings.</p>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
