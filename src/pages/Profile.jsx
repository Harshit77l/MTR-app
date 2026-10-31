import { UserRound } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/common/BottomNav'
import PrimaryButton from '../components/common/PrimaryButton'
import { logout, selectCurrentUser } from '../redux/slices/authSlice'

export default function Profile() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(selectCurrentUser)

  return (
    <div className="relative min-h-dvh bg-app pb-[84px]">
      <div className="px-5 pt-6">
        <h1 className="text-[22px] font-bold text-ink">Profile</h1>
        <div className="mt-8 flex flex-col items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-brand shadow-sm">
            <UserRound size={36} />
          </div>
          <p className="mt-4 text-[16px] font-semibold text-ink">{user?.name}</p>
          <p className="mt-1 text-[13px] text-slate-400">{user?.email}</p>
          <PrimaryButton
            className="mt-6"
            onClick={() => {
              dispatch(logout())
              navigate('/')
            }}
          >
            Sign out
          </PrimaryButton>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
