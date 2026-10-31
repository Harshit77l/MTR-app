import { Router } from 'express'
import asyncHandler from '../utils/asyncHandler.js'
import validateObjectId from '../middleware/validateObjectId.js'
import authenticate from '../middleware/authMiddleware.js'
import {
  cancelBooking,
  createBooking,
  getBookingById,
  getBookings,
} from '../controllers/bookingController.js'

const router = Router()

router.use(authenticate)
router.post('/', asyncHandler(createBooking))
router.get('/', asyncHandler(getBookings))
router.get('/:id', validateObjectId('id'), asyncHandler(getBookingById))
router.patch('/:id/cancel', validateObjectId('id'), asyncHandler(cancelBooking))

export default router
