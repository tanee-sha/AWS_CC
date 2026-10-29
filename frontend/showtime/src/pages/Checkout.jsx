import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getEventById } from "../data/events";

const PAY_OPTS = [
  { id: "upi", icon: "📱", label: "UPI", sub: "GPay, PhonePe, Paytm" },
  { id: "card", icon: "💳", label: "Credit / Debit Card", sub: "Visa, Mastercard, Rupay" },
  { id: "nb", icon: "🏦", label: "Net Banking", sub: "All major banks" },
  { id: "wallet", icon: "👜", label: "Mobile Wallets", sub: "Paytm, Amazon Pay" },
];

const VALID_COUPONS = {
  SHOW20: 0.20, MUSIC50: 50, SPORT10: 0.10, DILJIT: 0.15,
};

export default function Checkout({ user, addTicket }) {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const event = getEventById(id);
  const tickets = location.state?.tickets || [];

  const [payMethod, setPayMethod] = useState("upi");
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState("");
  const [name, setName] = useState(user?.phone || "");
  const [email, setEmail] = useState("");
  const [processing, setProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10 * 60);

  useEffect(() => {
    const t = setInterval(() => setTimeLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  if (!event || tickets.length === 0) {
    return (
      <div className="wrap pad center">
        <h2>Nothing to checkout</h2>
        <button className="btn-primary" onClick={() => navigate("/")} style={{ marginTop: 20 }}>← Go Home</button>
      </div>
    );
  }

  const subtotal = tickets.reduce((s, t) => s + t.price, 0);
  const convFee = Math.round(subtotal * 0.03);
  const discountAmt = discount > 1 ? discount : Math.round(subtotal * discount);
  const total = subtotal + convFee - discountAmt;

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");

  const applyCoupon = () => {
    const val = VALID_COUPONS[coupon.toUpperCase()];
    if (!val) { setCouponMsg("Invalid coupon code"); setDiscount(0); return; }
    setDiscount(val);
    setCouponMsg("✓ Coupon applied!");
  };

  const pay = () => {
    if (!name) return;
    setProcessing(true);
    setTimeout(() => {
      const bookingId = "ST" + Math.random().toString(36).slice(2, 8).toUpperCase();
      addTicket({
        bookingId,
        event,
        tickets,
        total: Math.round(total),
        seats: tickets.map((t) => t.seatId),
        paidAt: new Date().toISOString(),
      });
      navigate(`/confirmation/${bookingId}`);
    }, 2200);
  };

  if (processing) {
    return (
      <div style={{ height: "80vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 20 }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{ width: 48, height: 48, border: "3px solid var(--border2)", borderTop: "3px solid var(--accent)", borderRadius: "50%" }}
        />
        <h3 style={{ color: "var(--text2)" }}>Processing payment…</h3>
        <p style={{ color: "var(--text3)", fontSize: "0.83rem" }}>Please don't close this window</p>
      </div>
    );
  }

  return (
    <div className="checkout">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      <h1>Review Your Booking</h1>
      <div className="timer-chip" id="checkout-timer">
        ⏱ Completes in {mins}:{secs}
      </div>

      <div className="checkout-grid">
        {/* LEFT */}
        <div>
          {/* Contact */}
          <div className="card-box">
            <h3>📋 Contact Details</h3>
            <div className="field-group" style={{ marginBottom: 12 }}>
              <label className="field-label">Full Name</label>
              <input
                className="field-input"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                id="contact-name"
              />
            </div>
            <div className="field-group">
              <label className="field-label">Email</label>
              <input
                className="field-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="contact-email"
              />
            </div>
          </div>

          {/* Payment */}
          <div className="card-box">
            <h3>💳 Payment Options</h3>
            <div className="pay-options">
              {PAY_OPTS.map((opt) => (
                <div
                  key={opt.id}
                  className={`pay-opt${payMethod === opt.id ? " on" : ""}`}
                  onClick={() => setPayMethod(opt.id)}
                  id={`pay-opt-${opt.id}`}
                >
                  <div className="pay-opt-icon">{opt.icon}</div>
                  <div className="pay-opt-text">
                    <b>{opt.label}</b>
                    <small>{opt.sub}</small>
                  </div>
                  <div className="pay-radio" />
                </div>
              ))}
            </div>

            {payMethod === "card" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}
              >
                <input className="field-input" placeholder="Card number" id="card-number" />
                <div className="form-row">
                  <input className="field-input" placeholder="MM / YY" id="card-expiry" />
                  <input className="field-input" type="password" placeholder="CVV" maxLength={4} id="card-cvv" />
                </div>
              </motion.div>
            )}

            {payMethod === "upi" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                style={{ marginTop: 16 }}
              >
                <input className="field-input" placeholder="Enter UPI ID (e.g. name@upi)" id="upi-id" />
              </motion.div>
            )}
          </div>
        </div>

        {/* RIGHT – SUMMARY */}
        <div>
          <div className="summary-card">
            <h3>🎟️ Order Summary</h3>

            <div className="summary-event">
              <div className="summary-event-thumb">
                {{ music: "🎵", cricket: "🏏", sports: "⚽", dj: "🎧", festival: "🎉", comedy: "😂" }[event.category] || "🎪"}
              </div>
              <div className="summary-event-info">
                <b>{event.title}</b>
                <small>
                  {new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · {event.time}
                </small>
                <small>{event.venue}</small>
              </div>
            </div>

            <div className="summary-row">
              <span>{tickets.length} ticket{tickets.length > 1 ? "s" : ""}</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Convenience fee</span>
              <span>₹{convFee.toLocaleString()}</span>
            </div>
            {discountAmt > 0 && (
              <div className="summary-row disc">
                <span>Coupon discount</span>
                <b>− ₹{discountAmt.toLocaleString()}</b>
              </div>
            )}
            <div className="summary-row total">
              <span>Amount Payable</span>
              <span>₹{Math.round(total).toLocaleString()}</span>
            </div>

            {/* Coupon */}
            <div className="coupon-row" style={{ marginTop: 16 }}>
              <input
                className="field-input"
                placeholder="Coupon code"
                value={coupon}
                onChange={(e) => { setCoupon(e.target.value); setCouponMsg(""); }}
                id="coupon-input"
              />
              <button onClick={applyCoupon} id="apply-coupon-btn">Apply</button>
            </div>
            {couponMsg && (
              <p style={{ fontSize: "0.78rem", color: couponMsg.startsWith("✓") ? "var(--teal)" : "var(--accent)", marginBottom: 12 }}>
                {couponMsg}
              </p>
            )}

            <button
              className="btn-book"
              onClick={pay}
              disabled={!name}
              id="pay-now-btn"
            >
              Pay ₹{Math.round(total).toLocaleString()}
            </button>
            <p className="booking-info" style={{ marginTop: 10 }}>
              <span>🔒 Secure 256-bit SSL payment</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
