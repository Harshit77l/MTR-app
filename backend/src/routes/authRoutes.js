import { Router } from 'express'
import asyncHandler from '../utils/asyncHandler.js'
import authenticate from '../middleware/authMiddleware.js'
import { getMe, login, register } from '../controllers/authController.js'

const router = Router()

router.post('/register', asyncHandler(register))
router.post('/login', asyncHandler(login))
router.get('/me', authenticate, asyncHandler(getMe))

export default router
