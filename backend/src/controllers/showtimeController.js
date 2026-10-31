import Showtime from '../models/Showtime.js'
import mongoose from 'mongoose'
import { ApiError } from '../utils/apiError.js'

export async function getShowtimes(req, res) {
  const filter = {}

  if (req.query.movie) {
    if (!mongoose.isValidObjectId(req.query.movie)) throw new ApiError(400, 'Invalid movie query parameter')
    filter.movie = req.query.movie
  }
  if (req.query.theatre) {
    if (!mongoose.isValidObjectId(req.query.theatre)) throw new ApiError(400, 'Invalid theatre query parameter')
    filter.theatre = req.query.theatre
  }
  if (req.query.date) {
    const startOfDay = new Date(req.query.date)
    if (Number.isNaN(startOfDay.getTime())) throw new ApiError(400, 'Invalid date query parameter')
    startOfDay.setUTCHours(0, 0, 0, 0)
    const endOfDay = new Date(startOfDay)
    endOfDay.setUTCDate(endOfDay.getUTCDate() + 1)
    filter.date = { $gte: startOfDay, $lt: endOfDay }
  }

  const showtimes = await Showtime.find(filter)
    .populate('movie', 'title poster')
    .populate('theatre', 'name location city priceLabel logo')
    .sort({ date: 1, startTime: 1 })

  return res.status(200).json({ success: true, data: showtimes })
}

export async function getShowtimeSeats(req, res) {
  const showtime = await Showtime.findById(req.params.id).select('seats')

  if (!showtime) {
    throw new ApiError(404, 'Showtime not found')
  }

  return res.status(200).json({ success: true, data: showtime.seats })
}
