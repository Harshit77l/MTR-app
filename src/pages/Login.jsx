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
      <form onSubmit={handleSubmit} className="space-y-6">
        <AuthField
          placeholder="Email ID"
          type="email"
          value={form.email}
          onChange={(value) => setForm({ ...form, email: value })}
        />
        <AuthField
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(value) => setForm({ ...form, password: value })}
        />
        {error && <p className="text-sm text-rose-500">{error}</p>}
        <div className="pt-24">
          <PrimaryButton type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Logging in...' : 'Login'}
          </PrimaryButton>
        </div>
      </form>
    </AuthLayout>
  )
}

function AuthField({ placeholder, type, value, onChange }) {
  return (
    <div className="w-full">
      <input
        required
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-[46px] w-full border-0 border-b border-[#c2c6d0] bg-transparent px-1 text-[15px] text-[#2d3748] outline-none placeholder:text-[#8c9ba5] focus:border-brand transition-colors"
        placeholder={placeholder}
      />
    </div>
  )
}

function AuthLayout({ mode, location, children }) {
  const isLogin = mode === 'login'
  return (
    <div className="min-h-dvh bg-[#f7f8fd] px-6 pt-[72px]">
      <div className="flex flex-col items-center">
        <img src="/images/login-logo.svg" alt="" className="h-12 w-auto" />
        <h1 className="mt-6 text-center text-[22px] font-bold leading-[1.2] text-[#0f172a]">
          Creative Upaay<br />Hiring Assignment
        </h1>
      </div>
      <div className="mt-12">
        <div className="grid h-10 grid-cols-2 p-1 overflow-hidden rounded-[8px] bg-[#e8ebf0] text-[15px]">
          <Link
            to="/login"
            state={location.state}
            className={`flex items-center justify-center rounded-[6px] transition-all ${
              isLogin ? 'bg-white font-bold text-[#0f172a] shadow-sm' : 'text-[#64748b] font-medium'
            }`}
          >
            Login
          </Link>
          <Link
            to="/register"
            state={location.state}
            className={`flex items-center justify-center rounded-[6px] transition-all ${
              !isLogin ? 'bg-white font-bold text-[#0f172a] shadow-sm' : 'text-[#64748b] font-medium'
            }`}
          >
            Sign Up
          </Link>
        </div>
        <div className="mt-10">{children}</div>
      </div>
    </div>
  )
}

export { AuthField, AuthLayout }
