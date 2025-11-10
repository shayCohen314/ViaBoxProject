import express from 'express'
import viaBoxModel from '../models/Item.js'
const router = express.Router()
// Route: GET all items
// Fetch all documents from viaBoxModel
// Extract and flatten 'viaBoxItem' arrays
// Return all items as JSON

router.get('/', async (req, res) => {
  try {
    const viaBoxes = await viaBoxModel.find()
    const allItems = viaBoxes.flatMap(doc => doc.viaBoxItem || [])
    res.json(allItems)
  } catch (err) {
    console.error('Server error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})
export default router