import Theatre from '../models/Theatre.js'

export async function getTheatres(req, res) {
  const theatres = await Theatre.find().sort({ createdAt: 1 })

  return res.status(200).json({ success: true, data: theatres })
}
