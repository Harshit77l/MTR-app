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

export async function createBooking(req, res) {
  const { showtimeId, selectedSeats } = req.body
  assertUniqueSeats(selectedSeats)

  if (!mongoose.isValidObjectId(showtimeId)) {
    throw new ApiError(400, 'Invalid showtimeId')
  }

  const session = await mongoose.startSession()

  try {
    let booking

    await session.withTransaction(async () => {
      const showtime = await Showtime.findById(showtimeId).session(session)

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

      const seatUpdate = await Showtime.updateOne(
        {
          _id: showtimeId,
          $and: selectedSeats.map((seat) => ({
            seats: { $elemMatch: { seatNumber: seat, status: 'available' } },
          })),
        },
        { $set: { 'seats.$[seat].status': 'occupied' } },
        {
          arrayFilters: [{ 'seat.seatNumber': { $in: selectedSeats }, 'seat.status': 'available' }],
          session,
        },
      )

      if (seatUpdate.modifiedCount !== 1) {
        throw new ApiError(409, 'One or more selected seats are unavailable')
      }

      const ticketCount = selectedSeats.length
      const bookingFee = getBookingFee()
      const totalAmount = ticketCount * showtime.ticketPrice + bookingFee
      const createdBookings = await Booking.create(
        [
          {
            user: req.user._id,
            bookingId: `BK-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
            showtime: showtime._id,
            movie: showtime.movie,
            theatre: showtime.theatre,
            selectedSeats,
            ticketCount,
            ticketPrice: showtime.ticketPrice,
            bookingFee,
            totalAmount,
          },
        ],
        { session },
      )

      booking = createdBookings[0]
    })

    const populatedBooking = await populateBooking(Booking.findById(booking._id))

    return res.status(201).json({ success: true, data: populatedBooking })
  } catch (error) {
    if (transactionNotSupported(error)) {
      throw new ApiError(
        503,
        'Booking requires MongoDB transactions. Use MongoDB Atlas or a local replica set.',
      )
    }

    throw error
  } finally {
    await session.endSession()
  }
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

export async function cancelBooking(req, res) {
  const session = await mongoose.startSession()

  try {
    let cancelledBooking

    await session.withTransaction(async () => {
      const booking = await Booking.findOne({
        _id: req.params.id,
        user: req.user._id,
        status: 'confirmed',
      }).session(session)

      if (!booking) {
        const existingBooking = await Booking.findOne({
          _id: req.params.id,
          user: req.user._id,
        }).session(session)
        if (!existingBooking) throw new ApiError(404, 'Booking not found')
        throw new ApiError(409, 'Only confirmed bookings can be cancelled')
      }

      const seatUpdate = await Showtime.updateOne(
        { _id: booking.showtime },
        { $set: { 'seats.$[seat].status': 'available' } },
        {
          arrayFilters: [{ 'seat.seatNumber': { $in: booking.selectedSeats } }],
          session,
        },
      )

      if (seatUpdate.matchedCount !== 1) {
        throw new ApiError(404, 'Showtime not found for booking')
      }

      booking.status = 'cancelled'
      cancelledBooking = await booking.save({ session })
    })

    const populatedBooking = await populateBooking(Booking.findById(cancelledBooking._id))

    return res.status(200).json({ success: true, data: populatedBooking })
  } catch (error) {
    if (transactionNotSupported(error)) {
      throw new ApiError(
        503,
        'Cancellation requires MongoDB transactions. Use MongoDB Atlas or a local replica set.',
      )
    }

    throw error
  } finally {
    await session.endSession()
  }
}
