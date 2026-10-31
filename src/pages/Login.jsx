import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import PrimaryButton from '../components/common/PrimaryButton'
import { clearAuthError, login, selectAuthError, selectAuthStatus } from '../redux/slices/authSlice'

export default function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const status = useSelector(selectAuthStatus)
  const error = useSelector(selectAuthError)
  const [form, setForm] = useState({ email: '', password: '' })
  const destination = location.state?.from || '/'

  useEffect(() => () => dispatch(clearAuthError()), [dispatch])

  async function handleSubmit(event) {
    event.preventDefault()
    try {
      await dispatch(login(form)).unwrap()
      navigate(destination, { replace: true })
    } catch {
      // The rejected thunk error is rendered below.
    }
  }

  return (
    <AuthLayout mode="login" location={location}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthField label="Email" type="email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} />
        <AuthField label="Password" type="password" value={form.password} onChange={(value) => setForm({ ...form, password: value })} />
        {error && <p className="text-sm text-rose-500">{error}</p>}
        <PrimaryButton type="submit" className="mt-[190px]" disabled={status === 'loading'}>
          {status === 'loading' ? 'Signing in...' : 'Sign in'}
        </PrimaryButton>
      </form>
    </AuthLayout>
  )
}

function AuthField({ label, type, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-ink">{label}</span>
      <input required type={type} value={value} onChange={(event) => onChange(event.target.value)} className="h-[44px] w-full border-0 border-b border-[#c2c6d0] bg-transparent px-2 text-[14px] text-ink outline-none placeholder:text-[#697c9e] focus:border-brand" placeholder={label === 'Email' ? 'Email ID' : label} />
    </label>
  )
}

function AuthLayout({ mode, location, children }) {
  const isLogin = mode === 'login'
  return (
    <div className="min-h-dvh bg-[#f7f8fd] px-5 pt-[86px]">
      <div className="flex flex-col items-center">
        <img src="/images/login-logo.svg" alt="" className="h-11 w-[92px]" />
        <h1 className="mt-7 text-center text-[20px] font-bold leading-[1.15] text-black">
          Creative Upaay<br />Hiring Assignment
        </h1>
      </div>
      <div className="mt-[62px]">
        <div className="grid h-9 grid-cols-2 overflow-hidden rounded-[5px] bg-[#e8e8e8] text-[16px]">
          <Link to="/login" state={location.state} className={`flex items-center justify-center ${isLogin ? 'bg-white font-semibold' : ''}`}>Login</Link>
          <Link to="/register" state={location.state} className={`flex items-center justify-center ${!isLogin ? 'bg-white font-semibold' : ''}`}>Sign Up</Link>
        </div>
        <div className="mt-[55px]">{children}</div>
      </div>
    </div>
  )
}

export { AuthField, AuthLayout }
