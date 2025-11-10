/*
- Import necessary routing components and app pages
- Define main App component with routing configuration
- Use AppLayout as the main layout wrapper
- Set HomePage as the default (index) route
- Define route for CheckoutPage under "/checkout"
*/
import { Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import HomePage from "./components/HomePage";
import CheckoutPage from "./components/CheckoutPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="checkout" element={<CheckoutPage />} />
      </Route>
    </Routes>
  );
}