import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getEventById } from "../data/events";

const TIERS = [
  { id: "recliner", name: "VIP Lounge", mult: 3.5, rows: ["A", "B"], cols: 12, aisles: [3, 8], cls: "recliner" },
  { id: "prime", name: "Premium Tier", mult: 2.0, rows: ["C", "D", "E"], cols: 16, aisles: [3, 12], cls: "prime" },
  { id: "classic", name: "Standard Tier", mult: 1.0, rows: ["F", "G", "H", "J"], cols: 18, aisles: [4, 13], cls: "" },
];

export default function SeatsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = getEventById(id);

  const [maxQty, setMaxQty] = useState(2);
  const [showQtyModal, setShowQtyModal] = useState(false);
  const [selected, setSelected] = useState([]);
  const [hoverTip, setHoverTip] = useState(null);

  // Deterministic sold seats based on event filled percentage
  const soldSeats = useMemo(() => {
    const set = new Set();
    if (!event) return set;
    const filled = event.filledPct || 0.6;
    TIERS.forEach((tier) => {
      tier.rows.forEach((r, ri) => {
        for (let c = 1; c <= tier.cols; c++) {
          // Semi-random hash for consistent sold seats per event
          const hash = ((r.charCodeAt(0) * 31 + c * 17 + event.price) % 100) / 100;
          if (hash < filled) {
            set.add(`${tier.id}:${r}${c}`);
          }
        }
      });
    });
    return set;
  }, [event?.id, event?.filledPct]);

  if (!event) {
    return (
      <div className="wrap pad center" style={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
        <div>
          <h2>Event not found</h2>
          <button className="btn-primary" onClick={() => navigate("/")} style={{ marginTop: 16 }}>
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  const dateStr = new Date(event.date).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  const toggleSeat = (tier, seatId) => {
    const key = `${tier.id}:${seatId}`;
    if (selected.includes(key)) {
      setSelected(selected.filter((k) => k !== key));
    } else {
      if (selected.length >= maxQty) {
        // Replace oldest or keep within maxQty
        setSelected([...selected.slice(1), key]);
      } else {
        setSelected([...selected, key]);
      }
    }
  };

  const totalPrice = selected.reduce((sum, key) => {
    const [tierId] = key.split(":");
    const tier = TIERS.find((t) => t.id === tierId);
    return sum + event.price * (tier?.mult || 1);
  }, 0);

  const selectedLabels = selected.map((key) => key.split(":")[1]);

  const proceed = () => {
    const tickets = selected.map((key) => {
      const [tierId, seatId] = key.split(":");
      const tier = TIERS.find((t) => t.id === tierId);
      return {
        seatId,
        tierLabel: tier.name,
        price: Math.round(event.price * tier.mult),
      };
    });
    navigate(`/checkout/${event.id}`, { state: { tickets } });
  };

  return (
    <main className="seat-pg">
      {/* ── TOP BAR (BookMyShow Authentic Style) ── */}
      <section className="seat-top">
        <button className="back" onClick={() => navigate(-1)} aria-label="Go back">
          ‹
        </button>
        <div>
          <h2>{event.title}</h2>
          <p>
            {event.venue}, {event.city} | {dateStr}, {event.time} · {event.category.toUpperCase()}
          </p>
        </div>
        <button
          className="qty-chip"
          onClick={() => setShowQtyModal(true)}
          id="seat-qty-btn"
          title="Change number of tickets"
        >
          {maxQty} {maxQty === 1 ? "Ticket" : "Tickets"} ▾
        </button>
      </section>

      {/* ── SEAT MAP ── */}
      <div className="seat-scroll">
        <div className="seat-map">
          {TIERS.map((tier) => (
            <div className="tier" key={tier.id}>
              <div className="tier-name">
                ₹{Math.round(event.price * tier.mult).toLocaleString()} {tier.name}
              </div>

              {tier.rows.map((rowLetter) => (
                <div className="seat-row" key={rowLetter}>
                  <span className="row-l">{rowLetter}</span>
                  {Array.from({ length: tier.cols }, (_, ci) => {
                    const seatNum = ci + 1;
                    const seatId = `${rowLetter}${seatNum}`;
                    const key = `${tier.id}:${seatId}`;
                    const isSold = soldSeats.has(key);
                    const isSel = selected.includes(key);

                    return (
                      <span
                        key={seatId}
                        className="seat-cell"
                        style={{ marginRight: tier.aisles?.includes(ci) ? 24 : 0 }}
                      >
                        <motion.button
                          className={`seat ${tier.cls} ${isSold ? "sold" : ""} ${isSel ? "sel" : ""}`}
                          disabled={isSold}
                          whileHover={!isSold ? { scale: 1.2 } : {}}
                          whileTap={!isSold ? { scale: 0.9 } : {}}
                          animate={isSel ? { scale: [1, 1.25, 1] } : { scale: 1 }}
                          onClick={() => toggleSeat(tier, seatId)}
                          onMouseEnter={() => setHoverTip({ id: seatId, price: event.price * tier.mult, tier: tier.name })}
                          onMouseLeave={() => setHoverTip(null)}
                          aria-label={`Seat ${seatId}`}
                          id={`seat-${seatId}`}
                        >
                          {seatNum}
                        </motion.button>

                        {hoverTip?.id === seatId && !isSold && (
                          <em className="seat-tip">
                            {seatId} · ₹{Math.round(hoverTip.price).toLocaleString()}
                          </em>
                        )}
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
          ))}

          {/* ── STAGE / SCREEN CURVE VISUAL ── */}
          <div className="screen-wrap">
            <svg viewBox="0 0 400 60" preserveAspectRatio="none">
              <defs>
                <linearGradient id="scr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#f84464" stopOpacity=".7" />
                  <stop offset="1" stopColor="#f84464" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M10 50 Q200 -5 390 50 L390 60 Q200 12 10 60Z" fill="url(#scr)" />
              <path d="M10 52 Q200 -3 390 52" stroke="var(--red)" strokeWidth="3" fill="none" />
            </svg>
            <p>STAGE / PERFORMANCE AREA THIS WAY</p>
          </div>

          {/* ── SEAT LEGEND ── */}
          <div className="seat-legend">
            <span>
              <i className="seat" style={{ verticalAlign: "middle" }} /> Available
            </span>
            <span>
              <i className="seat sel" style={{ verticalAlign: "middle" }} /> Selected
            </span>
            <span>
              <i className="seat sold" style={{ verticalAlign: "middle" }} /> Sold Out
            </span>
          </div>
        </div>
      </div>

      {/* ── FLOATING PAYMENT BAR ── */}
      <AnimatePresence>
        {selected.length > 0 && (
          <motion.div
            className="pay-bar"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <div>
              <small style={{ color: "var(--ink2)", fontWeight: 600 }}>
                {selected.length} {selected.length > 1 ? "Seats" : "Seat"}: {selectedLabels.join(", ")}
              </small>
              <div style={{ fontSize: 13, color: "var(--mut)", marginTop: 2 }}>
                Total Payable: <strong style={{ color: "var(--red)", fontSize: 18 }}>₹{Math.round(totalPrice).toLocaleString()}</strong>
              </div>
            </div>

            <div className="pb-actions">
              <button
                className="btn-primary big"
                onClick={proceed}
                id="proceed-pay-btn"
              >
                Proceed to Checkout →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HOW MANY SEATS MODAL ── */}
      <AnimatePresence>
        {showQtyModal && (
          <motion.div
            className="modal-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowQtyModal(false)}
          >
            <motion.div
              className="modal qty"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>How Many Seats?</h3>
              <div className="veh">🎫</div>
              <div className="qty-row">
                {[1, 2, 3, 4, 5, 6, 8, 10].map((q) => (
                  <button
                    key={q}
                    className={maxQty === q ? "on" : ""}
                    onClick={() => {
                      setMaxQty(q);
                      if (selected.length > q) setSelected(selected.slice(0, q));
                      setShowQtyModal(false);
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
              <div className="qty-prices">
                {TIERS.map((t) => (
                  <div key={t.id}>
                    <small>{t.name}</small>
                    <b>₹{Math.round(event.price * t.mult)}</b>
                  </div>
                ))}
              </div>
              <button
                className="btn-primary"
                onClick={() => setShowQtyModal(false)}
                style={{ width: "100%", padding: "12px" }}
              >
                Select Seats
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
