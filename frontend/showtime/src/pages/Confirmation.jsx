import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const CAT_EMOJI = { music: "🎵", cricket: "🏏", sports: "⚽", dj: "🎧", festival: "🎉", comedy: "😂" };

export default function Confirmation({ tickets }) {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const booking = tickets.find((t) => t.bookingId === bookingId);

  if (!booking) return (
    <div className="wrap pad center">
      <h2>Booking not found</h2>
      <Link to="/" className="btn-primary" style={{ display: "inline-block", marginTop: 20 }}>← Go Home</Link>
    </div>
  );

  const { event, seats, total, paidAt } = booking;
  const emoji = CAT_EMOJI[event.category] || "🎪";
  const paidDate = new Date(paidAt);
  const eventDate = new Date(event.date);

  return (
    <div className="confirm-page">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="confirm-check"
      >
        ✅
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Booking Confirmed!
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{ color: "var(--text2)" }}
      >
        Your tickets are confirmed. Show this at the venue entry.
      </motion.p>

      {/* E-TICKET */}
      <motion.div
        className="e-ticket"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, type: "spring" }}
      >
        <div className="e-ticket-header">
          <small>E-Ticket · ShowTime Events</small>
          <h2>{event.title}</h2>
          <p>{event.venue}, {event.city}</p>
        </div>

        <div className="e-ticket-body">
          <div className="ticket-grid">
            <div className="ticket-field">
              <small>DATE</small>
              <b>{eventDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</b>
            </div>
            <div className="ticket-field">
              <small>TIME</small>
              <b>{event.time}</b>
            </div>
            <div className="ticket-field">
              <small>SEATS</small>
              <b>{seats.join(", ")}</b>
            </div>
            <div className="ticket-field">
              <small>TICKETS</small>
              <b>{booking.tickets.length} ticket{booking.tickets.length > 1 ? "s" : ""}</b>
            </div>
          </div>

          <hr className="ticket-divider" />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <small style={{ color: "var(--text3)", fontSize: "0.72rem" }}>BOOKING ID</small>
              <div style={{ fontFamily: "var(--mono)", fontWeight: 700, fontSize: "1rem" }}>{bookingId}</div>
            </div>
            <div style={{ fontSize: "3rem" }}>{emoji}</div>
          </div>

          <hr className="ticket-divider" />

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem" }}>
            <span style={{ color: "var(--text3)" }}>Total paid</span>
            <span style={{ fontFamily: "var(--mono)", fontWeight: 700 }}>₹{total.toLocaleString()}</span>
          </div>
          <div style={{ fontSize: "0.72rem", color: "var(--text3)", marginTop: 4 }}>
            Booked on {paidDate.toLocaleDateString("en-IN")} at {paidDate.toLocaleTimeString("en-IN")}
          </div>
        </div>
      </motion.div>

      <motion.div
        className="confirm-btns"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <button
          className="btn-outline"
          onClick={() => window.print()}
          id="download-ticket-btn"
        >
          🖨️ Print Ticket
        </button>
        <button
          className="btn-primary"
          onClick={() => navigate("/")}
          id="back-home-btn"
        >
          Book More →
        </button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        style={{ marginTop: 24, fontSize: "0.78rem", color: "var(--text3)" }}
      >
        A confirmation has been sent to your registered number.
      </motion.p>
    </div>
  );
}
