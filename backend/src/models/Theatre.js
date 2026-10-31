import mongoose from 'mongoose'

const screenSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    supportedFormats: {
      type: [String],
      enum: ['2D', '3D'],
      required: true,
      validate: {
        validator: (formats) => formats.length > 0,
        message: 'At least one screen format is required',
      },
    },
  },
  { _id: false },
)

const theatreSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    logo: { type: String, trim: true },
    logoBg: { type: String, trim: true, default: '#eef0f7' },
    priceLabel: { type: String, trim: true },
    screens: {
      type: [screenSchema],
      required: true,
      validate: {
        validator: (screens) => screens.length > 0,
        message: 'At least one screen is required',
      },
    },
  },
  { timestamps: true },
)

export default mongoose.model('Theatre', theatreSchema)
