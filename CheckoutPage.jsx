import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useOutletContext } from "react-router-dom";
import "./CheckoutPage.css";

// List of shipping options with id, label and price
const shippingOptions = [
  { id: "fast", label: "משלוח עד הבית תוך 3 ימים", price: 30 },
  { id: "standard", label: "משלוח תוך 14 ימים", price: 0 },
  { id: "pickup", label: "איסוף מהחנות", price: 0 },
];

// Allowed email domains for validation and suggestions
const emailDomains = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "walla.co.il",
  "walla.com",
  "net",
];

export default function CheckoutPage() {
  // Navigation and location hooks from react-router
  const navigate = useNavigate();
  const location = useLocation();
  const { setCartItems } = useOutletContext();

  // Cart items state initialized from location state or empty array
  const [cartItems] = useState(location.state?.cartItems || []);

  // Customer details state
  const [customer, setCustomer] = useState({
    idNumber: "",
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Shipping selection and UI state variables
  const [selectedShipping, setSelectedShipping] = useState(shippingOptions[0].id);
  const [error, setError] = useState("");
  const [showEmailSuggestions, setShowEmailSuggestions] = useState(false);
  const [emailInputLocalPart, setEmailInputLocalPart] = useState("");

  // Calculate totals for products and shipping
  const productsTotal = cartItems.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const shippingPrice = shippingOptions.find(opt => opt.id === selectedShipping)?.price || 0;
  const totalPrice = productsTotal + shippingPrice;

  // Handle input changes for form fields with specific validation for numbers and email
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "idNumber") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setCustomer(prev => ({ ...prev, [name]: numericValue }));
      return;
    }

    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setCustomer(prev => ({ ...prev, [name]: numericValue }));
      return;
    }

    if (name === "name") {
      setCustomer(prev => ({ ...prev, [name]: value }));
      return;
    }

    if (name === "email") {
      const filteredValue = value.replace(/[^a-zA-Z0-9@._+-]/g, "");
      setCustomer(prev => ({ ...prev, [name]: filteredValue }));

      const atIndex = filteredValue.indexOf("@");
      if (atIndex !== -1) {
        setShowEmailSuggestions(true);
        setEmailInputLocalPart(filteredValue.slice(0, atIndex));
      } else {
        setShowEmailSuggestions(false);
        setEmailInputLocalPart("");
      }
      return;
    }

    setCustomer(prev => ({ ...prev, [name]: value }));
  };

  // When clicking email suggestion, complete the email input
  const handleEmailSuggestionClick = (domain) => {
    const newEmail = emailInputLocalPart + "@" + domain;
    setCustomer(prev => ({ ...prev, email: newEmail }));
    setShowEmailSuggestions(false);
  };

  // Validation helper functions for form inputs
  const isValidIdNumber = (id) => /^[0-9]{5,9}$/.test(id);
  const isValidName = (name) => name.trim().length > 0;
  const isValidEmail = (email) => {
    const allowedDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'walla.co.il', 'net', 'walla.com'];
    const regex = /^[a-zA-Z0-9]+[a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(email)) return false;
    const domain = email.split('@')[1]?.toLowerCase();
    return allowedDomains.some(allowed => domain === allowed || domain.endsWith(`.${allowed}`));
  };
  const isValidPhone = (phone) => /^(050|051|052|053|054|055)[0-9]{7}$/.test(phone);
  const isValidAddress = (addr) => addr.trim().length > 5;
  const isCartValid = cartItems.length > 0 && cartItems.every(p => p.quantity >= 1);

  // Form submission handler with validation and server request
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isCartValid) {
      setError("עגלת הקניות ריקה או מכילה כמויות לא תקינות.");
      return;
    }
    if (!isValidIdNumber(customer.idNumber)) {
      setError("מספר תעודת זהות חייב להכיל בין 5 ל-9 ספרות.");
      return;
    }
    if (!isValidName(customer.name)) {
      setError("אנא הזן שם מלא תקין.");
      return;
    }
    if (!isValidEmail(customer.email)) {
      setError("אנא הזן כתובת מייל תקינה עם אותיות באנגלית ותחום מורשה.");
      return;
    }
    if (!isValidPhone(customer.phone)) {
      setError("מספר הטלפון חייב להכיל 10 ספרות ולהתחיל בקידומת 050-055 בלבד.");
      return;
    }
    if (!isValidAddress(customer.address)) {
      setError("אנא הזן כתובת למשלוח תקינה.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer,
          cartItems,
          shippingMethod: selectedShipping,
          shippingPrice,
          totalPrice,
        }),
      });

      if (!response.ok) {
        throw new Error("שגיאה בשליחת ההזמנה לשרת.");
      }
      if (window.confirm("תודה שטסת איתנו! ✈️\nהכרטיסים כבר עפים אליך, וההרפתקה מתחילה עכשיו! 🌍🧡\nניפגש על המסלול!")) {
        setCartItems([]);
        navigate("/");
      }
    } catch (err) {
      console.error("שגיאה בשליחת ההזמנה:", err);
      setError("אירעה שגיאה בשליחת ההזמנה. אנא נסו שוב.");
    }
  };

  // Scroll to top smoothly when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Render the checkout page UI with order summary, form and buttons
  return (
    <div className="checkout-container">
      <h2>תשלום</h2>
      <div className="section-block cart-section">
        <h3>סיכום הזמנה</h3>
        <ul className="product-list">
          {cartItems.map(p => (
            <li key={p.id} className="product-item">
              <img
                src={p.img}
                alt={p.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-image.png";
                }}
              />
              <div>
                <div><strong>{p.title}</strong></div>
                <div>כמות: {p.quantity}</div>
                <div>מחיר: {(p.price * p.quantity).toFixed(2)}₪</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="section-block customer-details-block">
          <h3>פרטי לקוח</h3>
          <label>
            תעודת זהות
            <input type="text" name="idNumber" value={customer.idNumber} onChange={handleInputChange} maxLength={9} required />
          </label>
          <label>
            שם מלא
            <input type="text" name="name" value={customer.name} onChange={handleInputChange} required />
          </label>
          <label style={{ position: "relative" }}>
            כתובת אימייל
            <input
              type="email"
              name="email"
              value={customer.email}
              onChange={handleInputChange}
              required
              autoComplete="off"
            />
            {showEmailSuggestions && (
              <ul className="email-suggestions-list" onMouseDown={e => e.preventDefault()}>
                {emailDomains.map(domain => (
                  <li key={domain} onClick={() => handleEmailSuggestionClick(domain)}>
                    {emailInputLocalPart}@{domain}
                  </li>
                ))}
              </ul>
            )}
          </label>
          <label>
            מספר טלפון
            <input type="tel" name="phone" value={customer.phone} onChange={handleInputChange} maxLength={10} inputMode="numeric" required />
          </label>
          <label>
            כתובת למשלוח
            <textarea name="address" value={customer.address} onChange={handleInputChange} required />
          </label>
        </div>
        <div className="section-block shipping-options-section" style={{ marginTop: "1.5rem" }}>
          <h3>אפשרויות משלוח</h3>
          <div className="shipping-options">
            {shippingOptions.map(opt => (
              <label key={opt.id}>
                <input
                  type="radio"
                  name="shipping"
                  value={opt.id}
                  checked={selectedShipping === opt.id}
                  onChange={e => setSelectedShipping(e.target.value)}
                />
                {opt.label} {opt.price > 0 ? `( ${opt.price}₪ )` : "(חינם)"}
              </label>
            ))}
          </div>
        </div>
        <div className="section-block payment-summary-section" style={{ marginTop: "1.5rem" }}>
          <h3>פרטי תשלום</h3>
          <div className="price-summary" style={{ marginBottom: "1rem" }}>
            <p><strong>סך המוצרים: {productsTotal.toFixed(2)}₪</strong></p>
            <p><strong>עלות משלוח: {shippingPrice.toFixed(2)}₪</strong></p>
            <p><strong>סה"כ לתשלום: {totalPrice.toFixed(2)}₪</strong></p>
            <div className="buttons-container">
              <button type="button" className="buttons-container" onClick={() => navigate("/")}>רגע, עוד ציוד?</button>
              <button type="submit">תשלום ובוא נמריא ✈️</button>
            </div>
          </div>
        </div>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
}