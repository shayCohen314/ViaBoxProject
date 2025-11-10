// Component for displaying and interacting with the shopping cart

import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Cart.css"; // External CSS file for styling

export default function Cart({ isOpen, cartItems, setCartItems, setCartOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isCheckoutPage = location.pathname === "/checkout";

  // Increase the quantity of a specific item
  const increaseQuantity = (id) => {
    if (isCheckoutPage) return; // Disable changes on checkout page
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Decrease the quantity of a specific item (minimum 1)
  const decreaseQuantity = (id) => {
    if (isCheckoutPage) return;
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // Remove an item from the cart entirely
  const removeItem = (id) => {
    if (isCheckoutPage) return;
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Update quantity from input field
  const updateQuantity = (id, newQuantity) => {
    if (isCheckoutPage) return;
    const qty = Math.max(1, Number(newQuantity) || 1);
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: qty } : item
      )
    );
  };

  // Calculate the total price of all items in the cart
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // If cart is not open, render nothing
  if (!isOpen) return null;

  return (
    <div className="cart-container">
      <h2 className="cart-title">העגלה שלך</h2>

      <div className="cart-items">
        {cartItems.length === 0 ? (
          <p>עגלה ריקה</p>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="item-header">
                <img
                  src={item.img}
                  alt={item.title}
                  className="item-image"
                />
                <div className="item-title">{item.title}</div>
              </div>

              <div className="item-controls">
                <button
                  onClick={() => increaseQuantity(item.id)}
                  disabled={isCheckoutPage}
                >
                  +
                </button>

                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.id, e.target.value)}
                  disabled={isCheckoutPage}
                  className="quantity-input"
                />

                <button
                  onClick={() => decreaseQuantity(item.id)}
                  disabled={isCheckoutPage}
                >
                  -
                </button>

                <div className="item-price">
                  <div>מחיר ליחידה: ₪ {item.price}</div>
                  <div>סה"כ: ₪ {(item.price * item.quantity).toFixed(2)}</div>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  disabled={isCheckoutPage}
                  className="remove-button"
                >
                  הסר
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="cart-total">
        סה"כ: ₪ {totalPrice.toFixed(2)}
      </div>

      <button
        disabled={cartItems.length === 0 || isCheckoutPage}
        onClick={() => {
          setCartOpen(false);
          navigate("/checkout", {
            state: { cartItems },
            replace: false,
          });
          // Scroll to top after navigating to checkout
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }, 100);
        }}
        className="checkout-button"
      >
        ביצוע הזמנה
      </button>
    </div>
  );
}