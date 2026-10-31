import mongoose from 'mongoose'
import Booking from '../models/Booking.js'
import Showtime from '../models/Showtime.js'
import { ApiError } from '../utils/apiError.js'

function getBookingFee() {
  const fee = Number(process.env.BOOKING_FEE || 20)
  return Number.isFinite(fee) && fee >= 0 ? fee : 20
}

function assertUniqueSeats(selectedSeats) {
  if (!Array.isArray(selectedSeats) || selectedSeats.length === 0) {
    throw new ApiError(400, 'selectedSeats must contain at least one seat')
  }

  if (selectedSeats.length > 6) {
    throw new ApiError(400, 'A maximum of 6 seats can be booked')
  }

  if (new Set(selectedSeats).size !== selectedSeats.length) {
    throw new ApiError(400, 'Duplicate seat selections are not allowed')
  }

  if (selectedSeats.some((seat) => typeof seat !== 'string' || !/^[A-M](?:[1-9]|1[0-2])$/.test(seat))) {
    throw new ApiError(400, 'Each seat must use a valid format from A1 to M12')
  }
}

function transactionNotSupported(error) {
  return (
    error.code === 20 ||
    error.codeName === 'IllegalOperation' ||
    error.message?.includes('Transaction numbers are only allowed')
  )
}

function populateBooking(query) {
  return query
    .populate('movie', 'title poster')
    .populate('theatre', 'name location city')
    .populate('showtime', 'screenName date startTime format ticketPrice')
}

async function performBooking({ showtimeId, selectedSeats, userId, session = null }) {
  const findQuery = Showtime.findById(showtimeId)
  if (session) findQuery.session(session)
  const showtime = await findQuery

  if (!showtime) {
    throw new ApiError(404, 'Showtime not found')
  }

  const availableSeats = new Set(
    showtime.seats
      .filter((seat) => seat.status === 'available')
      .map((seat) => seat.seatNumber),
  )

  if (selectedSeats.some((seat) => !availableSeats.has(seat))) {
    throw new ApiError(409, 'One or more selected seats are unavailable')
  }

  const updateOptions = {
    arrayFilters: [{ 'seat.seatNumber': { $in: selectedSeats }, 'seat.status': 'available' }],
  }
  if (session) updateOptions.session = session

  const seatUpdate = await Showtime.updateOne(
    {
      _id: showtimeId,
      $and: selectedSeats.map((seat) => ({
        seats: { $elemMatch: { seatNumber: seat, status: 'available' } },
      })),
    },
    { $set: { 'seats.$[seat].status': 'occupied' } },
    updateOptions,
  )

  if (seatUpdate.modifiedCount !== 1) {
    throw new ApiError(409, 'One or more selected seats are unavailable')
  }

  const ticketCount = selectedSeats.length
  const bookingFee = getBookingFee()
  const totalAmount = ticketCount * showtime.ticketPrice + bookingFee

  const bookingData = {
    user: userId,
    bookingId: `BK-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    showtime: showtime._id,
    movie: showtime.movie,
    theatre: showtime.theatre,
    selectedSeats,
    ticketCount,
    ticketPrice: showtime.ticketPrice,
    bookingFee,
    totalAmount,
    status: 'confirmed',
  }

  let booking
  try {
    if (session) {
      const created = await Booking.create([bookingData], { session })
      booking = created[0]
    } else {
      booking = await Booking.create(bookingData)
    }
  } catch (err) {
    // If running in standalone mode without a transaction and creation fails, restore seats
    if (!session) {
      await Showtime.updateOne(
        { _id: showtimeId },
        { $set: { 'seats.$[seat].status': 'available' } },
        { arrayFilters: [{ 'seat.seatNumber': { $in: selectedSeats } }] },
      )
    }
    throw err
  }

  return booking
}

export async function createBooking(req, res) {
  const { showtimeId, selectedSeats } = req.body
  assertUniqueSeats(selectedSeats)

  if (!mongoose.isValidObjectId(showtimeId)) {
    throw new ApiError(400, 'Invalid showtimeId')
  }

  const session = await mongoose.startSession()
  let booking

  try {
    await session.withTransaction(async () => {
      booking = await performBooking({
        showtimeId,
        selectedSeats,
        userId: req.user._id,
        session,
      })
    })
  } catch (error) {
    if (transactionNotSupported(error)) {
      // Fallback for standalone MongoDB environments: execute atomic document-level operation
      booking = await performBooking({
        showtimeId,
        selectedSeats,
        userId: req.user._id,
        session: null,
      })
    } else {
      throw error
    }
  } finally {
    await session.endSession()
  }

  const populatedBooking = await populateBooking(Booking.findById(booking._id))
  return res.status(201).json({ success: true, data: populatedBooking })
}

export async function getBookings(req, res) {
  const bookings = await populateBooking(Booking.find({ user: req.user._id })).sort({ bookingDate: -1 })

  return res.status(200).json({ success: true, data: bookings })
}

export async function getBookingById(req, res) {
  const booking = await populateBooking(Booking.findOne({ _id: req.params.id, user: req.user._id }))

  if (!booking) {
    throw new ApiError(404, 'Booking not found')
  }

  return res.status(200).json({ success: true, data: booking })
}

async function performCancellation({ bookingId, userId, session = null }) {
  const findQuery = Booking.findOne({
    _id: bookingId,
    user: userId,
  })
  if (session) findQuery.session(session)
  const booking = await findQuery

  if (!booking) {
    throw new ApiError(404, 'Booking not found')
  }

  if (booking.status !== 'confirmed') {
    throw new ApiError(409, 'Only confirmed bookings can be cancelled')
  }

  const updateOptions = {
    arrayFilters: [{ 'seat.seatNumber': { $in: booking.selectedSeats } }],
  }
  if (session) updateOptions.session = session

  const seatUpdate = await Showtime.updateOne(
    { _id: booking.showtime },
    { $set: { 'seats.$[seat].status': 'available' } },
    updateOptions,
  )

  if (seatUpdate.matchedCount !== 1) {
    throw new ApiError(404, 'Showtime not found for booking')
  }

  booking.status = 'cancelled'
  if (session) {
    await booking.save({ session })
  } else {
    await booking.save()
  }

  return booking
}

export async function cancelBooking(req, res) {
  const session = await mongoose.startSession()
  let cancelledBooking

  try {
    await session.withTransaction(async () => {
      cancelledBooking = await performCancellation({
        bookingId: req.params.id,
        userId: req.user._id,
        session,
      })
    })
  } catch (error) {
    if (transactionNotSupported(error)) {
      // Fallback for standalone MongoDB environments
      cancelledBooking = await performCancellation({
        bookingId: req.params.id,
        userId: req.user._id,
        session: null,
      })
    } else {
      throw error
    }
  } finally {
    await session.endSession()
  }

  const populatedBooking = await populateBooking(Booking.findById(cancelledBooking._id))
  return res.status(200).json({ success: true, data: populatedBooking })
}
