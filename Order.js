import mongoose from 'mongoose';
// Schema definition for customer details within an order
const orderSchema = new mongoose.Schema({
  customer: {
    idNumber: String,
    name: String,
    email: String,
    phone: String,
    address: String
  },
  // Array schema for cart items in the order
  cartItems: [
    {
      id: String,
      title: String,
      price: Number,
      quantity: Number
    }
  ],
  // Shipping details for the order
  shippingMethod: String,
  shippingPrice: Number,
  totalPrice: Number,
});

// Export model for orders collection
export default mongoose.model('Order', orderSchema);