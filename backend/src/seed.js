import dotenv from 'dotenv'
import mongoose from 'mongoose'
import connectDB from './config/db.js'
import Movie from './models/Movie.js'
import Theatre from './models/Theatre.js'
import Showtime from './models/Showtime.js'
import Booking from './models/Booking.js'
import User from './models/User.js'
import { generateSeatLayout } from './utils/seatLayout.js'

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
    description: 'Sister Irene once again comes face-to-face with Valak, the demonic nun, in 1956 France.',
    poster: '/images/nun2-poster.jpg',
    banner: '/images/nun2-poster.jpg',
    detailsHero: '/images/nun2-poster.jpg',
    flowHero: '/images/flow-hero.png',
    ticketStill: '/images/nun2-poster.jpg',
    genre: ['Horror', 'Mystery', 'Thriller'],
    duration: 110,
    language: 'English',
    releaseDate: '2026-09-10',
    status: 'now-showing',
    formats: ['2D'],
    rating: 4.5,
    ageRating: 'R',
    cast: [
      { name: 'Taissa Farmiga', role: 'Sister Irene', photo: '/images/cast-2.png' },
      { name: 'Jonas Bloquet', role: 'Frenchie', photo: '/images/cast-1.png' },
      { name: 'Storm Reid', role: 'Sister Debra', photo: '/images/cast-3.png' },
    ],
  },
  {
    title: 'Fast X',
    description: 'Dom Toretto and his family are targeted by the vengeful son of drug kingpin Hernan Reyes.',
    poster: '/images/fastx-poster.jpg',
    banner: '/images/fastx-poster.jpg',
    detailsHero: '/images/fastx-poster.jpg',
    flowHero: '/images/flow-hero.png',
    ticketStill: '/images/fastx-poster.jpg',
    genre: ['Action', 'Adventure', 'Crime'],
    duration: 141,
    language: 'English',
    releaseDate: '2026-05-19',
    status: 'now-showing',
    formats: ['2D', '3D'],
    rating: 4.5,
    ageRating: 'PG-13',
    cast: [
      { name: 'Vin Diesel', role: 'Dominic Toretto', photo: '/images/cast-1.png' },
      { name: 'Michelle Rodriguez', role: 'Letty Ortiz', photo: '/images/cast-2.png' },
      { name: 'Jason Momoa', role: 'Dante Reyes', photo: '/images/cast-statham.jpg' },
    ],
  },
  {
    title: 'John Wick: Chapter 4',
    description: 'John Wick uncovers a path to defeating The High Table, but before he can earn his freedom, he must face a new enemy.',
    poster: '/images/johnwick-poster.jpg',
    banner: '/images/johnwick-poster.jpg',
    detailsHero: '/images/johnwick-poster.jpg',
    flowHero: '/images/flow-hero.png',
    ticketStill: '/images/johnwick-poster.jpg',
    genre: ['Action', 'Thriller', 'Crime'],
    duration: 169,
    language: 'English',
    releaseDate: '2026-03-24',
    status: 'now-showing',
    formats: ['2D', '3D'],
    rating: 4.8,
    ageRating: 'R',
    cast: [
      { name: 'Keanu Reeves', role: 'John Wick', photo: '/images/cast-1.png' },
      { name: 'Donnie Yen', role: 'Caine', photo: '/images/cast-wu.jpg' },
      { name: 'Bill Skarsgård', role: 'Marquis', photo: '/images/cast-statham.jpg' },
    ],
  },
  {
    title: 'Dune: Part Two',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
    poster: '/images/poster-dune.jpg',
    banner: '/images/poster-dune.jpg',
    detailsHero: '/images/poster-dune.jpg',
    flowHero: '/images/flow-hero.png',
    ticketStill: '/images/poster-dune.jpg',
    genre: ['Sci-Fi', 'Adventure', 'Drama'],
    duration: 166,
    language: 'English',
    releaseDate: '2027-03-01',
    status: 'coming-soon',
    formats: ['2D', '3D'],
    rating: 4.8,
    ageRating: 'PG-13',
    cast: [
      { name: 'Timothée Chalamet', role: 'Paul Atreides', photo: '/images/cast-2.png' },
      { name: 'Zendaya', role: 'Chani', photo: '/images/cast-3.png' },
      { name: 'Rebecca Ferguson', role: 'Lady Jessica', photo: '/images/cast-shu.jpg' },
    ],
  },
  // --- Three Additional Realistic Movies ---
  {
    title: 'Oppenheimer',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
    poster: '/images/oppenheimer-poster.jpg',
    banner: '/images/oppenheimer-poster.jpg',
    detailsHero: '/images/oppenheimer-poster.jpg',
    flowHero: '/images/flow-hero.png',
    ticketStill: '/images/oppenheimer-poster.jpg',
    genre: ['Biography', 'Drama', 'History'],
    duration: 180,
    language: 'English',
    releaseDate: '2026-07-21',
    status: 'now-showing',
    formats: ['2D', '3D'],
    rating: 4.9,
    ageRating: 'R',
    cast: [
      { name: 'Cillian Murphy', role: 'J. Robert Oppenheimer', photo: '/images/cast-1.png' },
      { name: 'Emily Blunt', role: 'Katherine Oppenheimer', photo: '/images/cast-shu.jpg' },
      { name: 'Robert Downey Jr.', role: 'Lewis Strauss', photo: '/images/cast-statham.jpg' },
    ],
  },
  {
    title: 'Spider-Man: Across the Spider-Verse',
    description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.',
    poster: '/images/action-hero.jpg',
    banner: '/images/action-hero.jpg',
    detailsHero: '/images/action-hero.jpg',
    flowHero: '/images/flow-hero.png',
    ticketStill: '/images/action-hero.jpg',
    genre: ['Animation', 'Action', 'Adventure'],
    duration: 140,
    language: 'English',
    releaseDate: '2026-06-02',
    status: 'now-showing',
    formats: ['2D', '3D'],
    rating: 4.8,
    ageRating: 'PG',
    cast: [
      { name: 'Shameik Moore', role: 'Miles Morales', photo: '/images/cast-1.png' },
      { name: 'Hailee Steinfeld', role: 'Gwen Stacy', photo: '/images/cast-3.png' },
      { name: 'Oscar Isaac', role: 'Miguel O\'Hara', photo: '/images/cast-wu.jpg' },
    ],
  },
  {
    title: 'Mission: Impossible - Dead Reckoning',
    description: 'Ethan Hunt and his IMF team must track down a dangerous weapon before it falls into the wrong hands.',
    poster: '/images/details-hero.png',
    banner: '/images/details-hero.png',
    detailsHero: '/images/details-hero.png',
    flowHero: '/images/flow-hero.png',
    ticketStill: '/images/details-hero.png',
    genre: ['Action', 'Thriller', 'Adventure'],
    duration: 163,
    language: 'English',
    releaseDate: '2026-07-12',
    status: 'now-showing',
    formats: ['2D', '3D'],
    rating: 4.7,
    ageRating: 'PG-13',
    cast: [
      { name: 'Tom Cruise', role: 'Ethan Hunt', photo: '/images/cast-statham.jpg' },
      { name: 'Hayley Atwell', role: 'Grace', photo: '/images/cast-2.png' },
      { name: 'Simon Pegg', role: 'Benji Dunn', photo: '/images/cast-wu.jpg' },
    ],
  },
]

const theatres = [
  {
    name: 'The Grandview',
    location: 'Camp Aguinaldo',
    city: 'Quezon City',
    logo: '/images/logo-grandview.png',
    priceLabel: '₹320 - ₹450',
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
    priceLabel: '₹320',
    screens: [{ name: 'Screen 1', supportedFormats: ['2D', '3D'] }],
  },
  {
    name: 'Play Loft',
    location: 'Aurora Boulevard',
    city: 'Santa Mesa',
    logo: '/images/logo-playloft.png',
    priceLabel: '₹300 - ₹430',
    screens: [
      { name: 'Screen 1', supportedFormats: ['2D', '3D'] },
      { name: 'Screen 2', supportedFormats: ['2D'] },
    ],
  },
  {
    name: 'Cinemount',
    location: 'Baclaran',
    city: 'Paranaque City',
    logo: '/images/logo-cinemount.png',
    priceLabel: '₹350',
    screens: [{ name: 'Screen 1', supportedFormats: ['2D', '3D'] }],
  },
]

async function seed() {
  try {
    await connectDB()

    // 1. Idempotently ensure demo user exists
    let demoUser = await User.findOne({ email: 'demo@movieapp.com' })
    if (!demoUser) {
      demoUser = await User.create({
        name: 'Demo User',
        email: 'demo@movieapp.com',
        password: 'Demo@123',
      })
    }

    // 2. Idempotently upsert theatres
    const theatreDocs = {}
    for (const item of theatres) {
      const doc = await Theatre.findOneAndUpdate(
        { name: item.name },
        { $set: item },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      )
      theatreDocs[item.name] = doc
    }

    // 3. Idempotently upsert movies
    const movieDocs = {}
    for (const item of movies) {
      const doc = await Movie.findOneAndUpdate(
        { title: item.title },
        { $set: item },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      )
      movieDocs[item.title] = doc
    }

    // 4. Idempotently create showtimes with independent 156-seat inventories
    const grandview = theatreDocs['The Grandview']
    const cinemaOne = theatreDocs['CinemaOne']
    const playLoft = theatreDocs['Play Loft']
    const cinemount = theatreDocs['Cinemount']

    const showtimeDefinitions = [
      // Meg 2: The Trench
      {
        movieTitle: 'Meg 2: The Trench',
        theatre: grandview,
        screenName: 'Screen 1',
        date: '2026-11-10',
        startTime: '10:00 AM',
        format: '2D',
        ticketPrice: 280,
      },
      {
        movieTitle: 'Meg 2: The Trench',
        theatre: grandview,
        screenName: 'Screen 2',
        date: '2026-11-10',
        startTime: '06:00 PM',
        format: '3D',
        ticketPrice: 350,
      },
      {
        movieTitle: 'Meg 2: The Trench',
        theatre: playLoft,
        screenName: 'Screen 1',
        date: '2026-11-11',
        startTime: '01:30 PM',
        format: '2D',
        ticketPrice: 300,
      },
      {
        movieTitle: 'Meg 2: The Trench',
        theatre: cinemaOne,
        screenName: 'Screen 1',
        date: '2026-11-11',
        startTime: '07:00 PM',
        format: '3D',
        ticketPrice: 380,
      },

      // The Nun II
      {
        movieTitle: 'The Nun II',
        theatre: grandview,
        screenName: 'Screen 1',
        date: '2026-11-12',
        startTime: '02:00 PM',
        format: '2D',
        ticketPrice: 320,
      },
      {
        movieTitle: 'The Nun II',
        theatre: cinemount,
        screenName: 'Screen 1',
        date: '2026-11-12',
        startTime: '08:30 PM',
        format: '2D',
        ticketPrice: 350,
      },

      // Fast X
      {
        movieTitle: 'Fast X',
        theatre: playLoft,
        screenName: 'Screen 1',
        date: '2026-11-13',
        startTime: '06:00 PM',
        format: '2D',
        ticketPrice: 300,
      },
      {
        movieTitle: 'Fast X',
        theatre: playLoft,
        screenName: 'Screen 1',
        date: '2026-11-13',
        startTime: '09:00 PM',
        format: '3D',
        ticketPrice: 430,
      },
      {
        movieTitle: 'Fast X',
        theatre: grandview,
        screenName: 'Screen 2',
        date: '2026-11-14',
        startTime: '04:00 PM',
        format: '2D',
        ticketPrice: 320,
      },

      // John Wick: Chapter 4
      {
        movieTitle: 'John Wick: Chapter 4',
        theatre: cinemaOne,
        screenName: 'Screen 1',
        date: '2026-11-11',
        startTime: '08:00 PM',
        format: '2D',
        ticketPrice: 300,
      },
      {
        movieTitle: 'John Wick: Chapter 4',
        theatre: grandview,
        screenName: 'Screen 1',
        date: '2026-11-12',
        startTime: '09:30 PM',
        format: '3D',
        ticketPrice: 420,
      },

      // Oppenheimer (Added Movie 1)
      {
        movieTitle: 'Oppenheimer',
        theatre: grandview,
        screenName: 'Screen 1',
        date: '2026-11-10',
        startTime: '01:00 PM',
        format: '2D',
        ticketPrice: 340,
      },
      {
        movieTitle: 'Oppenheimer',
        theatre: grandview,
        screenName: 'Screen 1',
        date: '2026-11-10',
        startTime: '07:30 PM',
        format: '3D',
        ticketPrice: 450,
      },
      {
        movieTitle: 'Oppenheimer',
        theatre: playLoft,
        screenName: 'Screen 1',
        date: '2026-11-11',
        startTime: '05:00 PM',
        format: '2D',
        ticketPrice: 320,
      },

      // Spider-Man: Across the Spider-Verse (Added Movie 2)
      {
        movieTitle: 'Spider-Man: Across the Spider-Verse',
        theatre: cinemaOne,
        screenName: 'Screen 1',
        date: '2026-11-10',
        startTime: '03:30 PM',
        format: '2D',
        ticketPrice: 320,
      },
      {
        movieTitle: 'Spider-Man: Across the Spider-Verse',
        theatre: playLoft,
        screenName: 'Screen 2',
        date: '2026-11-11',
        startTime: '06:15 PM',
        format: '3D',
        ticketPrice: 410,
      },
      {
        movieTitle: 'Spider-Man: Across the Spider-Verse',
        theatre: grandview,
        screenName: 'Screen 2',
        date: '2026-11-12',
        startTime: '11:00 AM',
        format: '2D',
        ticketPrice: 320,
      },

      // Mission: Impossible - Dead Reckoning (Added Movie 3)
      {
        movieTitle: 'Mission: Impossible - Dead Reckoning',
        theatre: grandview,
        screenName: 'Screen 1',
        date: '2026-11-11',
        startTime: '04:00 PM',
        format: '2D',
        ticketPrice: 340,
      },
      {
        movieTitle: 'Mission: Impossible - Dead Reckoning',
        theatre: cinemount,
        screenName: 'Screen 1',
        date: '2026-11-11',
        startTime: '07:45 PM',
        format: '3D',
        ticketPrice: 380,
      },
      {
        movieTitle: 'Mission: Impossible - Dead Reckoning',
        theatre: cinemaOne,
        screenName: 'Screen 1',
        date: '2026-11-13',
        startTime: '05:30 PM',
        format: '2D',
        ticketPrice: 320,
      },

      // Dune: Part Two (Coming Soon)
      {
        movieTitle: 'Dune: Part Two',
        theatre: cinemount,
        screenName: 'Screen 1',
        date: '2027-03-01',
        startTime: '04:00 PM',
        format: '2D',
        ticketPrice: 350,
      },
    ]

    let firstShowtime = null
    for (const def of showtimeDefinitions) {
      const movieDoc = movieDocs[def.movieTitle]
      if (!movieDoc || !def.theatre) continue

      let showtime = await Showtime.findOne({
        movie: movieDoc._id,
        theatre: def.theatre._id,
        screenName: def.screenName,
        date: new Date(def.date),
        startTime: def.startTime,
        format: def.format,
      })

      if (!showtime) {
        showtime = await Showtime.create({
          movie: movieDoc._id,
          theatre: def.theatre._id,
          screenName: def.screenName,
          date: new Date(def.date),
          startTime: def.startTime,
          format: def.format,
          ticketPrice: def.ticketPrice,
          seats: generateSeatLayout(),
        })
      }

      if (!firstShowtime) firstShowtime = showtime
    }

    // 5. Idempotently ensure initial seed booking exists
    const existingSeedBooking = await Booking.findOne({ bookingId: 'BK-SEED-001' })
    if (!existingSeedBooking && firstShowtime) {
      const selectedSeats = ['A1', 'A2']
      await Showtime.updateOne(
        { _id: firstShowtime._id },
        { $set: { 'seats.$[seat].status': 'occupied' } },
        { arrayFilters: [{ 'seat.seatNumber': { $in: selectedSeats } }] },
      )

      await Booking.create({
        bookingId: 'BK-SEED-001',
        user: demoUser._id,
        showtime: firstShowtime._id,
        movie: firstShowtime.movie,
        theatre: firstShowtime.theatre,
        selectedSeats,
        ticketCount: selectedSeats.length,
        ticketPrice: firstShowtime.ticketPrice,
        bookingFee: Number(process.env.BOOKING_FEE || 20),
        totalAmount:
          selectedSeats.length * firstShowtime.ticketPrice +
          Number(process.env.BOOKING_FEE || 20),
        status: 'confirmed',
      })
    }

    console.log('Seed completed successfully (idempotent & non-destructive)')
  } catch (error) {
    console.error(`Seed failed: ${error.message}`)
    process.exitCode = 1
  } finally {
    await mongoose.disconnect()
  }
}

seed()
