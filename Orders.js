import express from 'express';
import orderModel from '../models/Order.js';

const router = express.Router();

// Route: POST new order
// Extract order data from request body
// Validate required fields presence
// Create new order document with provided data
// Save new order to database
// Respond with success message and order ID
// Handle errors and respond with appropriate status

router.post('/', async (req, res) => {
  try {
    const {
      customer,         
      cartItems,        
      shippingMethod,  
      shippingPrice,   
      totalPrice        
    } = req.body;
    if (!customer || !cartItems || !shippingMethod || totalPrice == null) {
      return res.status(400).json({ message: "שדות חובה חסרים." });
    }
    const newOrder = new orderModel({
      customer,
      cartItems,
      shippingMethod,
      shippingPrice,
      totalPrice,
    });
    await newOrder.save();
    res.status(201).json({ message: "ההזמנה נשמרה בהצלחה", orderId: newOrder._id });
  } catch (err) {
    console.error("שגיאה בשמירת ההזמנה:", err);
    res.status(500).json({ message: "אירעה שגיאה בשרת" });
  }
});
export default router;