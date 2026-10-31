import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import PrimaryButton from '../components/common/PrimaryButton'
import { AuthField, AuthLayout } from './Login'
import { clearAuthError, register, selectAuthError, selectAuthStatus } from '../redux/slices/authSlice'

export default function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const status = useSelector(selectAuthStatus)
  const error = useSelector(selectAuthError)
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [formError, setFormError] = useState(null)

  useEffect(() => () => dispatch(clearAuthError()), [dispatch])

  async function handleSubmit(event) {
    event.preventDefault()
    if (form.password !== form.confirmPassword) {
      setFormError('Passwords do not match')
      return
    }
    setFormError(null)
    try {
      await dispatch(register({
        name: form.name,
        email: form.email,
        password: form.password,
      })).unwrap()
      navigate(location.state?.from || '/', { replace: true })
    } catch {
      // The rejected thunk error is rendered below.
    }
  }

  return (
    <AuthLayout mode="register" location={location}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <AuthField
          placeholder="Name"
          type="text"
          value={form.name}
          onChange={(value) => setForm({ ...form, name: value })}
        />
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
        <AuthField
          placeholder="Confirm Password"
          type="password"
          value={form.confirmPassword}
          onChange={(value) => setForm({ ...form, confirmPassword: value })}
        />
        {(formError || error) && <p className="text-sm text-rose-500">{formError || error}</p>}
        <div className="pt-12">
          <PrimaryButton type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Signing Up...' : 'Sign Up'}
          </PrimaryButton>
        </div>
      </form>
    </AuthLayout>
  )
}
