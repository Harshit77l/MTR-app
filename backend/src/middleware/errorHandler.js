import mongoose from 'mongoose'

export default function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error)
  }

  let statusCode = error.statusCode || 500
  let message = error.message || 'Internal server error'

  if (error instanceof mongoose.Error.ValidationError) {
    statusCode = 400
    message = Object.values(error.errors)
      .map((validationError) => validationError.message)
      .join(', ')
  } else if (error.code === 11000) {
    statusCode = 409
    message = 'A record with the same unique value already exists'
  }

  console.error(`[${req.method} ${req.originalUrl}] ${message}`)

  return res.status(statusCode).json({
    success: false,
    error: message,
  })
}
