import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    bookingId: { type: String, required: true, unique: true, trim: true },
    showtime: { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime', required: true },
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    theatre: { type: mongoose.Schema.Types.ObjectId, ref: 'Theatre', required: true },
    selectedSeats: {
      type: [String],
      required: true,
      validate: {
        validator: (seats) => seats.length > 0 && seats.length <= 6,
        message: 'Select between 1 and 6 seats',
      },
    },
    ticketCount: { type: Number, required: true, min: 1, max: 6 },
    ticketPrice: { type: Number, required: true, min: 0 },
    bookingFee: { type: Number, required: true, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    bookingDate: { type: Date, default: Date.now, required: true },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed',
      required: true,
    },
  },
  { timestamps: true },
)

export default mongoose.model('Booking', bookingSchema)
