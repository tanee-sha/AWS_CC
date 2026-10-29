import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CAT_EMOJI = { music: "🎵", cricket: "🏏", sports: "⚽", dj: "🎧", festival: "🎉", comedy: "😂" };

export default function MyTickets({ tickets, user, setShowLogin }) {
  const navigate = useNavigate();

  if (!user) return (
    <div className="wrap pad center">
      <div style={{ fontSize: "3rem", marginBottom: 16 }}>🔒</div>
      <h2>Sign in to view your tickets</h2>
      <p style={{ color: "var(--text2)", marginBottom: 24 }}>Your booking history will appear here</p>
      <button className="btn-primary" onClick={() => setShowLogin(true)} id="signin-mytickets-btn">Sign in</button>
    </div>
  );

  return (
    <div className="my-tickets">
      <h1>🎫 My Tickets</h1>

      {tickets.length === 0 ? (
        <div className="empty-state">
          <div className="emoji">🎭</div>
          <h3>No bookings yet</h3>
          <p>Your confirmed event tickets will appear here</p>
          <button
            className="btn-primary"
            onClick={() => navigate("/")}
            style={{ marginTop: 20 }}
            id="explore-events-btn"
          >
            Explore Events →
          </button>
        </div>
      ) : (
        <div className="orders">
          {tickets.map((booking) => (
            <motion.div
              key={booking.bookingId}
              className="order"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="order-thumb">
                {CAT_EMOJI[booking.event.category] || "🎪"}
              </div>
              <div className="order-info">
                <h3>{booking.event.title}</h3>
                <p style={{ color: "var(--text2)", fontSize: "0.8rem" }}>
                  {booking.event.venue} · {new Date(booking.event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · {booking.event.time}
                </p>
                <p className="seats">Seats: {booking.seats.join(", ")}</p>
                <p style={{ fontSize: "0.72rem", color: "var(--text3)" }}>ID: {booking.bookingId}</p>
              </div>
              <div>
                <div style={{ fontFamily: "var(--mono)", fontWeight: 700, marginBottom: 8, fontSize: "0.9rem" }}>
                  ₹{booking.total.toLocaleString()}
                </div>
                <Link
                  to={`/confirmation/${booking.bookingId}`}
                  className="order-link"
                  id={`view-ticket-${booking.bookingId}`}
                >
                  View ticket →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
