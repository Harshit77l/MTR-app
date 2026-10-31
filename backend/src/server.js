import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import movieRoutes from './routes/movieRoutes.js'
import theatreRoutes from './routes/theatreRoutes.js'
import showtimeRoutes from './routes/showtimeRoutes.js'
import bookingRoutes from './routes/bookingRoutes.js'
import authRoutes from './routes/authRoutes.js'
import errorHandler from './middleware/errorHandler.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 5000

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Movie Ticket Booking API is running!",
  })
})

app.use('/api/movies', movieRoutes)
app.use('/api/theatres', theatreRoutes)
app.use('/api/showtimes', showtimeRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/bookings', bookingRoutes)

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  })
})

app.use(errorHandler)

async function startServer() {
  try {
    await connectDB()

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error(`Unable to start server: ${error.message}`)
    process.exit(1)
  }
}

startServer()
