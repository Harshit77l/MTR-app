import mongoose from 'mongoose'
import { ApiError } from '../utils/apiError.js'

export default function validateObjectId(parameter) {
  return (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params[parameter])) {
      return next(new ApiError(400, `Invalid ${parameter}`))
    }

    return next()
  }
}
