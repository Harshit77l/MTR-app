import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { ApiError } from '../utils/apiError.js'

export default async function authenticate(req, res, next) {
  const authorization = req.headers.authorization
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : null

  if (!token) return next(new ApiError(401, 'Authentication required'))
  if (!process.env.JWT_SECRET) return next(new ApiError(500, 'JWT_SECRET is not configured'))

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(payload.sub)
    if (!user) return next(new ApiError(401, 'User account no longer exists'))
    req.user = user
    return next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') return next(new ApiError(401, 'Token has expired'))
    return next(new ApiError(401, 'Invalid authentication token'))
  }
}
