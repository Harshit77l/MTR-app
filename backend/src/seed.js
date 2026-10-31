import dotenv from 'dotenv'
import mongoose from 'mongoose'
import connectDB from './config/db.js'
import Movie from './models/Movie.js'
import Theatre from './models/Theatre.js'
import Showtime from './models/Showtime.js'
import Booking from './models/Booking.js'
import User from './models/User.js'

dotenv.config()

const movies = [
  {
    title: 'Meg 2: The Trench',
    description: 'A research team encounters multiple threats while exploring the depths of the ocean, including a malevolent mining operation.',
    poster: '/images/meg2-poster.jpg',
    banner: '/images/meg2-hero.jpg',
    detailsHero: '/images/meg2-jetski.jpg',
    flowHero: '/images/flow-hero.png',
    ticketStill: '/images/meg2-banner.jpg',
    genre: ['Action', 'Sci-Fi', 'Horror'],
    duration: 116,
    language: 'English',
    releaseDate: '2026-06-10',
    status: 'now-showing',
    formats: ['2D', '3D'],
    rating: 4.5,
    ageRating: 'PG-13',
    cast: [
      { name: 'Jason Statham', role: 'Jonas Taylor', photo: '/images/cast-statham.jpg' },
      { name: 'Jing Wu', role: 'Jiuming Zhang', photo: '/images/cast-wu.jpg' },
      { name: 'Shuya Sophia Cai', role: 'Meiying', photo: '/images/cast-shu.jpg' },
    ],
  },
  {
    title: 'The Nun II',
    description: 'Sister Irene once again comes face-to-face with Valak, the demonic nun.',
    poster: '/images/nun2-poster.jpg',
    banner: '/images/nun2-poster.jpg',
    detailsHero: '/images/nun2-poster.jpg',
    genre: ['Action', 'Thriller'],
    duration: 169,
    language: 'English',
    releaseDate: '2026-09-10',
    status: 'now-showing',
    formats: ['2D'],
    rating: 4.5,
    cast: [{ name: 'Taissa Farmiga', role: 'Sister Irene', photo: '/images/cast-2.png' }],
  },
  {
    title: 'Fast X',
    description: 'Dom Toretto and his family are targeted by the vengeful son of a drug kingpin.',
    poster: '/images/fastx-poster.jpg',
    banner: '/images/fastx-poster.jpg',
    detailsHero: '/images/fastx-poster.jpg',
    genre: ['Action', 'Adventure'],
    duration: 141,
    language: 'English',
    releaseDate: '2026-05-19',
    status: 'now-showing',
    formats: ['2D', '3D'],
    rating: 4.5,
    cast: [{ name: 'Vin Diesel', role: 'Dominic Toretto', photo: '/images/cast-1.png' }],
  },
  {
    title: 'John Wick: Chapter 4',
    description: 'John Wick discovers a path to defeating the High Table.',
    poster: '/images/johnwick-poster.jpg',
    banner: '/images/johnwick-poster.jpg',
    detailsHero: '/images/johnwick-poster.jpg',
    genre: ['Action', 'Thriller'],
    duration: 169,
    language: 'English',
    releaseDate: '2026-03-24',
    status: 'now-showing',
    formats: ['2D', '3D'],
    rating: 4.5,
    cast: [{ name: 'Keanu Reeves', role: 'John Wick', photo: '/images/cast-1.png' }],
  },
  {
    title: 'Dune: Part Two',
    description: 'Paul Atreides unites with the Fremen while seeking revenge.',
    poster: '/images/poster-dune.jpg',
    banner: '/images/poster-dune.jpg',
    detailsHero: '/images/poster-dune.jpg',
    genre: ['Sci-Fi', 'Adventure'],
    duration: 166,
    language: 'English',
    releaseDate: '2027-03-01',
    status: 'coming-soon',
    formats: ['2D', '3D'],
    rating: 4.8,
    cast: [{ name: 'Timothee Chalamet', role: 'Paul Atreides', photo: '/images/cast-2.png' }],
  },
]

const theatres = [
  {
    name: 'The Grandview',
    location: 'Camp Aguinaldo',
    city: 'Quezon City',
    logo: '/images/logo-grandview.png',
    priceLabel: '₱320 - ₱450',
    screens: [
      { name: 'Screen 1', supportedFormats: ['2D', '3D'] },
      { name: 'Screen 2', supportedFormats: ['2D'] },
    ],
  },
  {
    name: 'CinemaOne',
    location: 'A Cruz',
    city: 'Pasay City',
    logo: '/images/logo-cinemaone.png',
    priceLabel: '₱320',
    screens: [{ name: 'Screen 1', supportedFormats: ['2D', '3D'] }],
  },
  {
    name: 'Play Loft',
    location: 'Aurora Boulevard',
    city: 'Santa Mesa',
    logo: '/images/logo-playloft.png',
    priceLabel: '₱300 - ₱430',
    screens: [{ name: 'Screen 1', supportedFormats: ['2D', '3D'] }],
  },
  {
    name: 'Cinemount',
    location: 'Baclaran',
    city: 'Paranaque City',
    logo: '/images/logo-cinemount.png',
    priceLabel: '₱350',
    screens: [{ name: 'Screen 1', supportedFormats: ['2D', '3D'] }],
  },
]

async function seed() {
  try {
    await connectDB()
    let demoUser = await User.findOne({ email: 'demo@movieapp.com' })
    if (!demoUser) {
      demoUser = await User.create({
        name: 'Demo User',
        email: 'demo@movieapp.com',
        password: 'Demo@123',
      })
    }
    await Promise.all([
      Booking.deleteMany({}),
      Movie.deleteMany({}),
      Theatre.deleteMany({}),
      Showtime.deleteMany({}),
    ])

    const createdMovies = await Movie.insertMany(movies)
    const createdTheatres = await Theatre.insertMany(theatres)

    const createdShowtimes = await Showtime.insertMany([
      {
        movie: createdMovies[0]._id,
        theatre: createdTheatres[0]._id,
        screenName: 'Screen 1',
        date: '2026-11-10',
        startTime: '10:00 AM',
        format: '2D',
        ticketPrice: 280,
      },
      {
        movie: createdMovies[0]._id,
        theatre: createdTheatres[0]._id,
        screenName: 'Screen 2',
        date: '2026-11-10',
        startTime: '06:00 PM',
        format: '3D',
        ticketPrice: 350,
      },
      {
        movie: createdMovies[3]._id,
        theatre: createdTheatres[1]._id,
        screenName: 'Screen 1',
        date: '2026-11-11',
        startTime: '08:00 PM',
        format: '2D',
        ticketPrice: 300,
      },
      {
        movie: createdMovies[1]._id,
        theatre: createdTheatres[0]._id,
        screenName: 'Screen 1',
        date: '2026-11-12',
        startTime: '02:00 PM',
        format: '2D',
        ticketPrice: 320,
      },
      {
        movie: createdMovies[2]._id,
        theatre: createdTheatres[2]._id,
        screenName: 'Screen 1',
        date: '2026-11-13',
        startTime: '06:00 PM',
        format: '2D',
        ticketPrice: 300,
      },
      {
        movie: createdMovies[2]._id,
        theatre: createdTheatres[2]._id,
        screenName: 'Screen 1',
        date: '2026-11-13',
        startTime: '09:00 PM',
        format: '3D',
        ticketPrice: 430,
      },
      {
        movie: createdMovies[4]._id,
        theatre: createdTheatres[3]._id,
        screenName: 'Screen 1',
        date: '2027-03-01',
        startTime: '04:00 PM',
        format: '2D',
        ticketPrice: 350,
      },
    ])

    const selectedSeats = ['A1', 'A2']
    await Showtime.updateOne(
      { _id: createdShowtimes[0]._id },
      { $set: { 'seats.$[seat].status': 'occupied' } },
      { arrayFilters: [{ 'seat.seatNumber': { $in: selectedSeats } }] },
    )

    await Booking.create({
      bookingId: 'BK-SEED-001',
      user: demoUser._id,
      showtime: createdShowtimes[0]._id,
      movie: createdMovies[0]._id,
      theatre: createdTheatres[0]._id,
      selectedSeats,
      ticketCount: selectedSeats.length,
      ticketPrice: createdShowtimes[0].ticketPrice,
      bookingFee: Number(process.env.BOOKING_FEE || 20),
      totalAmount:
        selectedSeats.length * createdShowtimes[0].ticketPrice +
        Number(process.env.BOOKING_FEE || 20),
      status: 'confirmed',
    })

    console.log('Seed data created successfully')
  } catch (error) {
    console.error(`Seed failed: ${error.message}`)
    process.exitCode = 1
  } finally {
    await mongoose.disconnect()
  }
}

seed()
