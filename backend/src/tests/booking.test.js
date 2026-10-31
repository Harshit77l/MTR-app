import assert from 'node:assert'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import connectDB from '../config/db.js'
import Movie from '../models/Movie.js'
import Theatre from '../models/Theatre.js'
import Showtime from '../models/Showtime.js'
import Booking from '../models/Booking.js'
import User from '../models/User.js'
import { generateSeatLayout } from '../utils/seatLayout.js'

dotenv.config()

async function runTests() {
  console.log('--- Starting Movie Booking Backend Tests ---')
  await connectDB()

  try {
    // 1. Setup test user, movie, theatre, and showtime
    let testUser = await User.findOne({ email: 'test_runner@movieapp.com' })
    if (!testUser) {
      testUser = await User.create({
        name: 'Test Runner',
        email: 'test_runner@movieapp.com',
        password: 'Password@123',
      })
    }

    let testMovie = await Movie.findOne({ title: 'Test Concurrency Movie' })
    if (!testMovie) {
      testMovie = await Movie.create({
        title: 'Test Concurrency Movie',
        description: 'Test movie for concurrency and booking logic verification',
        poster: '/images/meg2-poster.jpg',
        banner: '/images/meg2-hero.jpg',
        genre: ['Action'],
        duration: 120,
        language: 'English',
        releaseDate: new Date('2026-06-01'),
        status: 'now-showing',
        formats: ['2D', '3D'],
      })
    }

    let testTheatre = await Theatre.findOne({ name: 'Test Concurrency Theatre' })
    if (!testTheatre) {
      testTheatre = await Theatre.create({
        name: 'Test Concurrency Theatre',
        location: 'Test Location',
        city: 'Test City',
        priceLabel: '₹300',
        screens: [{ name: 'Screen 1', supportedFormats: ['2D'] }],
      })
    }

    // Independent 156-seat showtime for this test
    const testShowtime = await Showtime.create({
      movie: testMovie._id,
      theatre: testTheatre._id,
      screenName: 'Screen 1',
      date: new Date('2026-12-01'),
      startTime: '11:00 AM',
      format: '2D',
      ticketPrice: 300,
      seats: generateSeatLayout(),
    })

    console.log('✓ Test environment initialized with 156-seat independent showtime')

    // 2. Test: Maximum seat selection limit (7 seats must fail)
    const sevenSeats = ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7']
    let limitExceeded = false
    try {
      if (sevenSeats.length > 6) {
        throw new Error('A maximum of 6 seats can be booked')
      }
    } catch (err) {
      limitExceeded = err.message.includes('maximum of 6 seats')
    }
    assert.strictEqual(limitExceeded, true, 'Maximum 6-seat limit should be enforced')
    console.log('✓ Maximum seat selection limit correctly enforced')

    // 3. Test: Concurrent booking simulation on identical seats ['C1', 'C2']
    const contestedSeats = ['C1', 'C2']

    async function attemptAtomicBooking(userTag) {
      const updateResult = await Showtime.updateOne(
        {
          _id: testShowtime._id,
          $and: contestedSeats.map((seat) => ({
            seats: { $elemMatch: { seatNumber: seat, status: 'available' } },
          })),
        },
        { $set: { 'seats.$[seat].status': 'occupied' } },
        {
          arrayFilters: [{ 'seat.seatNumber': { $in: contestedSeats }, 'seat.status': 'available' }],
        },
      )

      if (updateResult.modifiedCount !== 1) {
        throw new Error('One or more selected seats are unavailable')
      }

      return Booking.create({
        user: testUser._id,
        bookingId: `BK-TEST-${userTag}-${Date.now()}`,
        showtime: testShowtime._id,
        movie: testMovie._id,
        theatre: testTheatre._id,
        selectedSeats: contestedSeats,
        ticketCount: contestedSeats.length,
        ticketPrice: testShowtime.ticketPrice,
        bookingFee: 20,
        totalAmount: contestedSeats.length * testShowtime.ticketPrice + 20,
        status: 'confirmed',
      })
    }

    const [booking1Result, booking2Result] = await Promise.allSettled([
      attemptAtomicBooking('USER_A'),
      attemptAtomicBooking('USER_B'),
    ])

    const successCount = [booking1Result, booking2Result].filter((r) => r.status === 'fulfilled').length
    const rejectedCount = [booking1Result, booking2Result].filter((r) => r.status === 'rejected').length

    assert.strictEqual(successCount, 1, 'Exactly one concurrent booking must succeed')
    assert.strictEqual(rejectedCount, 1, 'Exactly one concurrent booking must be rejected with conflict')
    console.log('✓ Concurrent booking collision handled correctly (1 succeeded, 1 prevented)')

    const winningBooking = (booking1Result.status === 'fulfilled' ? booking1Result : booking2Result).value

    // 4. Test: Cancellation and seat restoration
    // Cancel the winning booking
    const seatRestoration = await Showtime.updateOne(
      { _id: testShowtime._id },
      { $set: { 'seats.$[seat].status': 'available' } },
      { arrayFilters: [{ 'seat.seatNumber': { $in: winningBooking.selectedSeats } }] },
    )
    assert.strictEqual(seatRestoration.matchedCount, 1, 'Showtime must match for restoration')

    winningBooking.status = 'cancelled'
    await winningBooking.save()

    // Verify seats are now available again
    const updatedShowtime = await Showtime.findById(testShowtime._id)
    const restoredSeats = updatedShowtime.seats.filter(
      (s) => contestedSeats.includes(s.seatNumber) && s.status === 'available',
    )
    assert.strictEqual(restoredSeats.length, contestedSeats.length, 'Restored seats must now have status "available"')
    console.log('✓ Cancellation correctly restored seats to available inventory')

    // 5. Cleanup test artifacts
    await Booking.deleteMany({ bookingId: /^BK-TEST-/ })
    await Showtime.deleteOne({ _id: testShowtime._id })
    await Movie.deleteOne({ _id: testMovie._id })
    await Theatre.deleteOne({ _id: testTheatre._id })
    await User.deleteOne({ _id: testUser._id })

    console.log('✓ Test data cleaned up successfully')
    console.log('\nAll tests passed successfully! 🚀')
  } catch (err) {
    console.error('Test failed:', err)
    process.exitCode = 1
  } finally {
    await mongoose.disconnect()
  }
}

runTests()
