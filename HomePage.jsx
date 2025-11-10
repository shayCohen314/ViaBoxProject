import React, { useState, useEffect } from 'react';
import './HomePage.css';
import coverImage from '../images/cover.png';
import { useOutletContext } from 'react-router-dom';

export default function HomePage() {
  // Get context values from parent component 
  const { cartItems, setCartItems, setCartOpen } = useOutletContext();

  // State to store list of product boxes
  const [boxes, setBoxes] = useState([]);
  // State to store currently opened box for detailed view
  const [openBox, setOpenBox] = useState(null);

  // Fetch product data from backend when component mounts
  useEffect(() => {
    fetch('/items')
      .then(res => res.json())
      .then(data => {
        // Map raw data into desired format
        const mappedData = data.map(item => ({
          id: item._id,
          title: item.title,
          desc: item.desc,
          img: item.img,
          details: item.details,
          price: item.price
        }));
        setBoxes(mappedData); // Update state with product boxes
      })
      .catch(err => {
        console.error('שגיאה בטעינת הקופסאות:', err); // Error fetching boxes
      });
  }, []);

  // Add selected box to the cart
  const handleAddToCart = (box) => {
    const existingItem = cartItems.find(item => item.id === box.id);
    if (existingItem) {
      // If item already in cart, increment its quantity
      incrementQuantity(box.id);
    } else {
      // Add new item to cart with quantity = 1
      setCartItems([...cartItems, { ...box, quantity: 1 }]);
      setCartOpen(true); // Open the cart UI
    }
  };

  // Increment quantity of an item in the cart
  const incrementQuantity = (boxId) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === boxId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  return (
    <div className="homepage">
      {/* Cover image banner */}
      <div style={{ maxWidth: "800px", margin: "0 auto", overflow: "hidden" }}>
        <img
          src={coverImage}
          alt="Banner"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            objectFit: "contain",
          }}
        />
      </div>

      {/* About section */}
      <section className="about">
        <p className="about-title"> טסים מסביב לעולם בלי לצאת מהבית 🌍</p>
        <p className="about-sub">
          כל קופסה היא מסע חושי: טעמים, ריחות, מוזיקה, סרטונים ופריטים ייחודיים מהיעד שבחרתם.
          מתאים כמתנה, לפינוק עצמי או כחוויה משפחתית מרתקת.
        </p>
      </section>

      {/* Product list section */}
      <section className="products">
        <h2>הקופסאות שלנו</h2>
        <div className="product-grid">
          {/* Loop over each product box and render it */}
          {boxes.map((box) => (
            <div key={box.id} className="product-card">
              <img src={box.img} alt={box.title} className="box-image" />
              <h3>{box.title}</h3>
              <p>{box.desc}</p>
              <p>{box.price}₪</p>
              <div className="button-row">
                {/* Info button opens modal */}
                <button className="info-button" onClick={() => setOpenBox(box)}>ℹ מידע</button>
                {/* Add to cart button */}
                <button
                  className="info-button"
                  onClick={() => handleAddToCart(box)}
                >
                  ➕ לעגלה
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal overlay for showing box details */}
      {openBox && (
        <div className="overlay" onClick={() => setOpenBox(null)}>
          {/* Clicking inside the modal shouldn't close it */}
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{openBox.title}</h2>
            <p style={{ whiteSpace: 'pre-line' }}>{openBox.details}</p>
            <button onClick={() => setOpenBox(null)}>סגור</button>
          </div>
        </div>
      )}
    </div>
  );
}