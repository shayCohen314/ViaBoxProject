import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Item from './models/Item.js';
import ordersRouter from './routes/Orders.js';

const app = express();
const PORT = 5000;

// Middleware: Enable CORS for cross-origin requests
app.use(cors());

// Middleware: Parse incoming JSON requests
app.use(express.json());

// Connect to MongoDB with mongoose
mongoose.connect('mongodb+srv://c1494344:shaycohen219@mydb.f5dekfs.mongodb.net/mydb?retryWrites=true&w=majority&appName=mydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// GET route for retrieving all items from database
app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    console.error('Error getting items:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Use orders router for handling /orders endpoints
app.use('/orders', ordersRouter);

// Start server and listen on defined port
app.listen(PORT, () => {
  console.log('Server running on http://localhost:${PORT}');
});