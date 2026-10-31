import Movie from '../models/Movie.js'

export async function getMovies(req, res) {
  const movies = await Movie.find().sort({ createdAt: 1 })

  return res.status(200).json({ success: true, data: movies })
}
