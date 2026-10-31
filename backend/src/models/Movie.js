import mongoose from 'mongoose'

const castMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, trim: true },
    photo: { type: String, trim: true },
  },
  { _id: false },
)

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    poster: { type: String, required: true, trim: true },
    banner: { type: String, required: true, trim: true },
    detailsHero: { type: String, trim: true },
    flowHero: { type: String, trim: true },
    ticketStill: { type: String, trim: true },
    genre: { type: [String], required: true, trim: true },
    duration: { type: Number, required: true, min: 1 },
    language: { type: String, required: true, trim: true },
    releaseDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['now-showing', 'coming-soon'],
      required: true,
    },
    formats: {
      type: [String],
      enum: ['2D', '3D'],
      required: true,
      validate: {
        validator: (formats) => formats.length > 0,
        message: 'At least one format is required',
      },
    },
    cast: { type: [castMemberSchema], default: [] },
    rating: { type: Number, min: 0, max: 10, default: 0 },
    ageRating: { type: String, trim: true, default: 'PG-13' },
  },
  { timestamps: true },
)

export default mongoose.model('Movie', movieSchema)
