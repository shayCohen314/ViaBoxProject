// Navbar component displaying logo, site title, home button, and shopping cart icon
import React from "react";
import { IoHome } from "react-icons/io5"; // Home icon from react-icons
import { ShoppingCart } from "phosphor-react"; // Shopping cart icon
import { Link } from "react-router-dom"; // For navigation
import logo from '../images/Logo2.png'; // Logo image
import './Navbar.css'; // Navbar styles

export default function Navbar({ onCartToggle, cartCount }) {
  return (
    <nav className="navbar">  
      {/* Left: Shopping cart icon */}
      <div
        className="navbar-cart"
        onClick={onCartToggle} // Toggle cart visibility on click
        role="button" // For accessibility (treated as a button)
        tabIndex={0} // Makes div focusable
        onKeyDown={(e) => e.key === 'Enter' && onCartToggle()} // Toggle on Enter key
        aria-label="Open/Close shopping cart" 
      >
        <ShoppingCart size={28} />
        <span className="cart-count">{cartCount}</span> {/* Number of items in cart */}
      </div>

      {/* Center: Site title and subtitle */}
      <div className="navbar-title">
        <p>
          <span className="title-main">ViaBox</span> {/* Main title */}
          <span className="title-sub">Every box is a new destination</span> {/* Subtitle */}
        </p>
      </div>

      {/* Right: Logo and Home button */}
      <div className="navbar-right">
        <Link to="/" className="navbar-home">
          <IoHome size={24} /> {/* Home icon linking to main page */}
          <img src={logo} alt="Logo" className="navbar-logo" /> {/* Company logo */}
        </Link>
      </div>
    </nav>
  );
}