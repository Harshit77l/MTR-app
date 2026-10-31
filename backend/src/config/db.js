import mongoose from 'mongoose'

export default async function connectDB() {
  const mongoUri = process.env.MONGO_URI

  if (!mongoUri) {
    throw new Error('MONGO_URI is not defined in the environment')
  }

  try {
    const connection = await mongoose.connect(mongoUri)
    console.log(`MongoDB connected: ${connection.connection.host}`)
  } catch (error) {
    throw new Error(`MongoDB connection failed: ${error.message}`)
  }
}
