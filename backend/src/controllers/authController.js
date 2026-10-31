import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { ApiError } from '../utils/apiError.js'

function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email, createdAt: user.createdAt }
}

function createToken(user) {
  if (!process.env.JWT_SECRET) throw new ApiError(500, 'JWT_SECRET is not configured')
  return jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

function validateCredentials(name, email, password, requireName = false) {
  if (requireName && (!name || typeof name !== 'string' || name.trim().length < 2)) {
    throw new ApiError(400, 'Name must contain at least 2 characters')
  }
  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ApiError(400, 'Enter a valid email address')
  }
  if (!password || typeof password !== 'string' || password.length < 8) {
    throw new ApiError(400, 'Password must contain at least 8 characters')
  }
}

export async function register(req, res) {
  const { name, email, password } = req.body
  validateCredentials(name, email, password, true)

  const normalizedEmail = email.trim().toLowerCase()
  if (await User.exists({ email: normalizedEmail })) {
    throw new ApiError(409, 'An account with that email already exists')
  }

  const user = await User.create({ name: name.trim(), email: normalizedEmail, password })
  return res.status(201).json({ success: true, data: { token: createToken(user), user: publicUser(user) } })
}

export async function login(req, res) {
  const { email, password } = req.body
  validateCredentials(null, email, password)

  const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password')
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(401, 'Invalid email or password')
  }

  return res.status(200).json({ success: true, data: { token: createToken(user), user: publicUser(user) } })
}

export function getMe(req, res) {
  return res.status(200).json({ success: true, data: { user: publicUser(req.user) } })
}
