import { Router } from 'express'
import asyncHandler from '../utils/asyncHandler.js'
import { getMovies } from '../controllers/movieController.js'

const router = Router()

router.get('/', asyncHandler(getMovies))

export default router
