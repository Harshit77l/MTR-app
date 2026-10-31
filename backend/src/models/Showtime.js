import mongoose from 'mongoose'
import { generateSeatLayout } from '../utils/seatLayout.js'

const seatSchema = new mongoose.Schema(
  {
    row: { type: String, required: true, trim: true },
    column: { type: Number, required: true, min: 1, max: 12 },
    seatNumber: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['available', 'occupied'],
      default: 'available',
      required: true,
    },
  },
  { _id: false },
)

const showtimeSchema = new mongoose.Schema(
  {
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    theatre: { type: mongoose.Schema.Types.ObjectId, ref: 'Theatre', required: true },
    screenName: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true, trim: true },
    format: { type: String, enum: ['2D', '3D'], required: true },
    ticketPrice: { type: Number, required: true, min: 0 },
    seats: {
      type: [seatSchema],
      default: generateSeatLayout,
      required: true,
    },
  },
  { timestamps: true },
)

showtimeSchema.index(
  { movie: 1, theatre: 1, screenName: 1, date: 1, startTime: 1, format: 1 },
  { unique: true },
)

export default mongoose.model('Showtime', showtimeSchema)
