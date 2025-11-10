import mongoose from 'mongoose'
// Schema definition for items
const itemSchema = new mongoose.Schema({
  title: String,
  desc: String,
  img: String,
  details: String,
  price: Number
})

// Export model linked to 'viaBox' collection
export default mongoose.model('Item', itemSchema, 'viaBox')