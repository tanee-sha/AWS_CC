import { useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getEventById, events as allEvents } from "../data/events";
import EventCard, { EventPoster } from "../components/EventCard";

const CATEGORY_LIGHT_GRADIENTS = {
  music: "linear-gradient(135deg, #ffffff 0%, #faf5ff 45%, #f3e8ff 100%)",
  cricket: "linear-gradient(135deg, #ffffff 0%, #f0fdf4 45%, #dcfce7 100%)",
  sports: "linear-gradient(135deg, #ffffff 0%, #eff6ff 45%, #dbeafe 100%)",
  dj: "linear-gradient(135deg, #ffffff 0%, #faf5ff 45%, #ede9fe 100%)",
  festival: "linear-gradient(135deg, #ffffff 0%, #fffbeb 45%, #fef3c7 100%)",
  comedy: "linear-gradient(135deg, #ffffff 0%, #fff7ed 45%, #ffedd5 100%)",
};

const SAMPLE_REVIEWS = [
  { name: "Aarav Sharma", rating: 5, time: "2 days ago", comment: "Unbelievable production quality and electric atmosphere! Definitely worth every rupee." },
  { name: "Pooja Mehta", rating: 5, time: "1 week ago", comment: "The sound system and crowd management were top notch. E-ticket entry was super smooth." },
  { name: "Rohan Varma", rating: 4, time: "2 weeks ago", comment: "Great line-up, high energy performances throughout! Highly recommend attending." },
];

function DetailRail({ title, sub, children }) {
  const rowRef = useRef(null);
  const scroll = (dir) => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: dir * 640, behavior: "smooth" });
    }
  };

  return (
    <section className="rail" style={{ marginTop: 40 }}>
      <div className="rail-head">
        <div>
          <h2>{title}</h2>
          {sub && <p>{sub}</p>}
        </div>
      </div>
      <div className="rail-wrap">
        <button className="arr l" onClick={() => scroll(-1)} aria-label="Previous">
          ‹
        </button>
        <div className="rail-row" ref={rowRef}>
          {children}
        </div>
        <button className="arr r" onClick={() => scroll(1)} aria-label="Next">
          ›
        </button>
      </div>
    </section>
  );
}

export default function EventDetail({ user, setShowLogin }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = getEventById(id);
  const [descExpanded, setDescExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!event) {
    return (
      <div className="wrap pad center" style={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
        <div>
          <h2>Event Not Found</h2>
          <p className="muted" style={{ margin: "10px 0 20px" }}>The event you are looking for does not exist or has ended.</p>
          <Link to="/" className="btn-primary">← Explore Other Events</Link>
        </div>
      </div>
    );
  }

  const dateStr = new Date(event.date).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleBook = () => {
    navigate(`/seats/${event.id}`);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const bgGrad = CATEGORY_LIGHT_GRADIENTS[event.category] || CATEGORY_LIGHT_GRADIENTS.music;

  // Other events in the same city (excluding current)
  const sameCityEvents = allEvents.filter(
    (e) => e.id !== event.id && (e.city === event.city || e.category === event.category)
  );

  // Recommended popular events across India
  const otherPopularEvents = allEvents.filter(
    (e) => e.id !== event.id && !sameCityEvents.some((sc) => sc.id === e.id)
  );

  return (
    <main style={{ paddingBottom: 60 }}>
      {/* ── UNIFORM LIGHT THEME EVENT BANNER ── */}
      <section className="mv-banner" style={{ background: bgGrad }}>
        <div className="wrap mv-in">
          {/* Poster Visual */}
          <motion.div
            className="mv-poster"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <EventPoster event={event} />
            <div className="mv-poster-foot">
              {event.filledPct > 0.85 ? "🔥 High Demand" : "🎟️ Instant E-Ticket"}
            </div>
          </motion.div>

          {/* Event Details */}
          <div className="mv-info">
            <Link to="/" className="mv-back" id="back-to-events-link">
              ← Back to all events
            </Link>

            <motion.h1
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {event.title}
            </motion.h1>

            {event.subtitle && (
              <p className="mv-sub">{event.subtitle}</p>
            )}

            <div className="mv-rate">
              <span>⭐ {event.rating}</span>
              <em>({event.votes.toLocaleString()} verified ratings)</em>
            </div>

            <div className="mv-fmt">
              <b>{event.category.toUpperCase()}</b>
              {event.tags?.map((t) => (
                <b key={t}>{t}</b>
              ))}
            </div>

            <div className="mv-meta">
              <span>📅 <strong>{dateStr}</strong></span>
              <span>🕕 <strong>{event.time} · {event.duration}</strong></span>
              <span>📍 <strong>{event.venue}, {event.city}</strong></span>
            </div>

            <div className="mv-price">
              Starting from <strong>₹{event.price.toLocaleString()}</strong> / ticket
            </div>

            <div className="mv-actions">
              <button
                className="btn-primary big"
                onClick={handleBook}
                id="book-tickets-btn"
              >
                Book Tickets
              </button>
              <button
                className="btn-secondary"
                onClick={handleShare}
                id="share-event-btn"
              >
                {copied ? "✓ Link Copied!" : "🔗 Share Event"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── EVENT BODY CONTENT ── */}
      <div className="wrap mv-body">
        {/* About */}
        <h2>About This Event</h2>
        <p className="syn">
          {descExpanded
            ? event.description
            : event.description.slice(0, 240) + (event.description.length > 240 ? "…" : "")}
        </p>
        {event.description.length > 240 && (
          <button
            className="link-btn"
            onClick={() => setDescExpanded(!descExpanded)}
            style={{ marginTop: 8, cursor: "pointer", display: "inline-block" }}
          >
            {descExpanded ? "Show less" : "Read more →"}
          </button>
        )}

        <hr />

        {/* Cast / Lineup */}
        {event.cast?.length > 0 && (
          <>
            <h2>Line-up & Performers</h2>
            <div className="cast">
              {event.cast.map((c, idx) => (
                <motion.div
                  key={c.name}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                >
                  <div className="cast-av" style={{ background: "linear-gradient(135deg, var(--red), #ff7a5c)" }}>
                    {c.name.charAt(0)}
                  </div>
                  <b>{c.name}</b>
                  <small>{c.role}</small>
                </motion.div>
              ))}
            </div>
            <hr />
          </>
        )}

        {/* Event Guidelines */}
        <h2>Event Guidelines & Amenities</h2>
        <div className="guide-grid">
          <div className="guide-card">
            <span>⚡</span>
            <div>
              <b>Instant E-Tickets</b>
              <small>Delivered instantly to SMS & Email</small>
            </div>
          </div>
          <div className="guide-card">
            <span>👥</span>
            <div>
              <b>Total Capacity</b>
              <small>{event.totalSeats.toLocaleString()} seats across zones</small>
            </div>
          </div>
          <div className="guide-card">
            <span>⏱</span>
            <div>
              <b>Event Duration</b>
              <small>{event.duration} uninterrupted live show</small>
            </div>
          </div>
          <div className="guide-card">
            <span>🛡️</span>
            <div>
              <b>Verified Entry</b>
              <small>100% genuine guaranteed tickets</small>
            </div>
          </div>
        </div>

        <hr />

        {/* Reviews */}
        <h2>Audience Reviews</h2>
        <div className="reviews">
          {SAMPLE_REVIEWS.map((r, i) => (
            <div key={i} className="review">
              <div className="rv-top">
                <strong>{r.name}</strong>
                <em>{"★".repeat(r.rating)}</em>
              </div>
              <p>"{r.comment}"</p>
              <small>{r.time} · Verified attendee</small>
            </div>
          ))}
        </div>

        <hr />

        {/* ── MORE EVENTS IN CITY / REGION ── */}
        <DetailRail
          title={`🔥 More Events in ${event.city}`}
          sub={`Popular live entertainment happening in and around ${event.city}`}
        >
          {sameCityEvents.map((ev) => (
            <EventCard
              key={ev.id}
              event={ev}
              onClick={(e) => {
                navigate(`/event/${e.id}`);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          ))}
        </DetailRail>

        {/* ── RECOMMENDED EVENTS ACROSS INDIA ── */}
        {otherPopularEvents.length > 0 && (
          <DetailRail
            title="🌟 You Might Also Like"
            sub="Top concerts, stadium matches and comedy festivals across India"
          >
            {otherPopularEvents.map((ev) => (
              <EventCard
                key={ev.id}
                event={ev}
                onClick={(e) => {
                  navigate(`/event/${e.id}`);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            ))}
          </DetailRail>
        )}
      </div>
    </main>
  );
}
