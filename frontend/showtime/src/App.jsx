import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import "./styles/main.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";

import Home from "./pages/Home";
import EventsPage from "./pages/EventsPage";
import EventDetail from "./pages/EventDetail";
import SeatsPage from "./pages/SeatsPage";
import Checkout from "./pages/Checkout";
import Confirmation from "./pages/Confirmation";
import MyTickets from "./pages/MyTickets";

export default function App() {
  const [city, setCity] = useState("Mumbai");
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [bookedTickets, setBookedTickets] = useState([]);
  const [toasts, setToasts] = useState([]);

  const addToast = (msg, type = "info") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setShowLogin(false);
    addToast(`Welcome back! 🎉`, "success");
  };

  const addTicket = (booking) => {
    setBookedTickets((prev) => [...prev, booking]);
    addToast("Booking confirmed! 🎫", "success");
  };

  return (
    <>
      <Navbar
        city={city}
        setCity={setCity}
        user={user}
        setShowLogin={setShowLogin}
      />

      <Routes>
        <Route path="/" element={<Home city={city} />} />
        <Route path="/events" element={<EventsPage />} />
        <Route
          path="/event/:id"
          element={<EventDetail user={user} setShowLogin={setShowLogin} />}
        />
        <Route
          path="/seats/:id"
          element={<SeatsPage addTicket={addTicket} />}
        />
        <Route
          path="/checkout/:id"
          element={<Checkout user={user} addTicket={addTicket} />}
        />
        <Route
          path="/confirmation/:bookingId"
          element={<Confirmation tickets={bookedTickets} />}
        />
        <Route
          path="/my-tickets"
          element={
            <MyTickets
              tickets={bookedTickets}
              user={user}
              setShowLogin={setShowLogin}
            />
          }
        />
      </Routes>

      <Footer />

      {/* Login Modal */}
      <AnimatePresence>
        {showLogin && (
          <LoginModal
            onClose={() => setShowLogin(false)}
            onSuccess={handleLogin}
          />
        )}
      </AnimatePresence>

      {/* Toast Container */}
      <div className="toast-container" id="toast-container">
        <AnimatePresence>
          {toasts.map((t) => (
            <div key={t.id} className={`toast ${t.type}`}>
              {t.msg}
            </div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
