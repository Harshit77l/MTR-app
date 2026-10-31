import { Router } from 'express'
import asyncHandler from '../utils/asyncHandler.js'
import { getTheatres } from '../controllers/theatreController.js'

const router = Router()

router.get('/', asyncHandler(getTheatres))

export default router
