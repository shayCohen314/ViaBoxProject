import React, { useState, useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Cart from "./Cart";

export default function AppLayout() {
  // State: toggle cart open/close
  const [cartOpen, setCartOpen] = useState(false);

  // State: cart items initialized from localStorage (lazy init)
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // Sync cartItems to localStorage on changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Toggle cart open state
  const toggleCart = () => setCartOpen((prev) => !prev);

  // Get current location from react-router
  const location = useLocation();

  // Ref for main content to control scroll
  const mainRef = useRef(null);

  // Scroll main content to top on route change
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.pathname]);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar onCartToggle={toggleCart} cartCount={cartItems.length} />

      <div
        style={{
          display: "flex",
          flex: 1,
          height: "calc(100vh - 100px)",
          overflow: "hidden",
        }}
      >
        {cartOpen && (
          <div
            style={{
              width: 300,
              transition: "width 0.3s ease",
              overflow: "hidden",
            }}
          >
            <Cart
              isOpen={true}
              cartItems={cartItems}
              setCartItems={setCartItems}
              setCartOpen={setCartOpen}
            />
          </div>
        )}

        <main
          ref={mainRef} // Reference for smooth scroll on route changes
          style={{
            flex: 1,
            padding: "2rem",
            overflowY: "auto",
          }}
        >
          <Outlet context={{ cartItems, setCartItems, setCartOpen }} />
        </main>
      </div>
    </div>
  );
}