import { Router } from 'express'
import asyncHandler from '../utils/asyncHandler.js'
import validateObjectId from '../middleware/validateObjectId.js'
import { getShowtimeSeats, getShowtimes } from '../controllers/showtimeController.js'

const router = Router()

router.get('/', asyncHandler(getShowtimes))
router.get('/:id/seats', validateObjectId('id'), asyncHandler(getShowtimeSeats))

export default router
