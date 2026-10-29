import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getFeatured, events as allEvents, categories, getEventsByCity } from "../data/events";
import EventCard, { EventPoster } from "../components/EventCard";

const CATEGORY_ICONS = {
  music: "🎵", cricket: "🏏", sports: "⚽",
  dj: "🎧", festival: "🎉", comedy: "😂",
};

const HERO_LIGHT_GRADIENTS = {
  music: "linear-gradient(135deg, #ffffff 0%, #faf5ff 45%, #f3e8ff 100%)",
  cricket: "linear-gradient(135deg, #ffffff 0%, #f0fdf4 45%, #dcfce7 100%)",
  sports: "linear-gradient(135deg, #ffffff 0%, #eff6ff 45%, #dbeafe 100%)",
  dj: "linear-gradient(135deg, #ffffff 0%, #faf5ff 45%, #ede9fe 100%)",
  festival: "linear-gradient(135deg, #ffffff 0%, #fffbeb 45%, #fef3c7 100%)",
  comedy: "linear-gradient(135deg, #ffffff 0%, #fff7ed 45%, #ffedd5 100%)",
};

const OFFERS = [
  { code: "SHOW20", title: "20% OFF", desc: "Up to ₹200 on first booking", bg: "linear-gradient(135deg,#ff5e3a,#ff8c42)" },
  { code: "MUSIC50", title: "₹50 FLAT OFF", desc: "On all live concert tickets", bg: "linear-gradient(135deg,#a855f7,#6366f1)" },
  { code: "SPORT10", title: "10% CASHBACK", desc: "On cricket & sports matches", bg: "linear-gradient(135deg,#0d9488,#14b8a6)" },
  { code: "DILJIT", title: "EARLY ACCESS", desc: "Diljit Aura Tour special offer", bg: "linear-gradient(135deg,#d97706,#f59e0b)" },
];

function Rail({ title, sub, link, children }) {
  const rowRef = useRef(null);
  const scroll = (dir) => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: dir * 640, behavior: "smooth" });
    }
  };

  return (
    <section className="rail">
      <div className="rail-head">
        <div>
          <h2>{title}</h2>
          {sub && <p>{sub}</p>}
        </div>
        {link}
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

export default function Home({ city }) {
  const navigate = useNavigate();
  const featured = getFeatured();
  const [heroIdx, setHeroIdx] = useState(0);
  const [activeCat, setActiveCat] = useState("all");
  const [copied, setCopied] = useState(null);

  const heroEvent = featured[heroIdx] || featured[0];
  const cityEvents = getEventsByCity(city, activeCat);

  // Auto-advance hero
  useEffect(() => {
    const t = setInterval(() => setHeroIdx((i) => (i + 1) % featured.length), 5500);
    return () => clearInterval(t);
  }, [featured.length]);

  const handleBook = (event) => navigate(`/event/${event.id}`);

  const copyOffer = (code) => {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const dateStr = (d) =>
    new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  const heroBg = HERO_LIGHT_GRADIENTS[heroEvent.category] || HERO_LIGHT_GRADIENTS.music;

  return (
    <main style={{ paddingBottom: 60 }}>
      {/* ── UNIFORM LIGHT HERO CAROUSEL ── */}
      <section className="hero">
        <div className="wrap">
          <AnimatePresence mode="wait">
            <motion.div
              key={heroIdx}
              className="hero-slide"
              style={{ background: heroBg }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <div className="hero-glow" />

              <div className="hero-text">
                <span className="hero-tag">
                  {CATEGORY_ICONS[heroEvent.category] || "🎪"} {heroEvent.category}
                </span>

                <motion.h2
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {heroEvent.title}
                </motion.h2>

                <motion.h3
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 }}
                >
                  {heroEvent.subtitle}
                </motion.h3>

                <motion.div
                  className="hero-meta"
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <span>📅 <strong>{dateStr(heroEvent.date)}</strong></span>
                  <span>🕕 <strong>{heroEvent.time}</strong></span>
                  <span>📍 <strong>{heroEvent.venue}, {heroEvent.city}</strong></span>
                  <span>⭐ <strong>{heroEvent.rating}</strong> ({heroEvent.votes.toLocaleString()} reviews)</span>
                </motion.div>

                <motion.div
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 }}
                >
                  <div className="hero-price">
                    From <strong>₹{heroEvent.price.toLocaleString()}</strong>
                  </div>

                  <div className="hero-actions">
                    <button
                      className="btn-primary"
                      onClick={() => handleBook(heroEvent)}
                      id={`hero-book-${heroEvent.id}`}
                    >
                      Book Tickets
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={() => navigate(`/event/${heroEvent.id}`)}
                      id={`hero-details-${heroEvent.id}`}
                    >
                      View Details →
                    </button>
                  </div>
                </motion.div>
              </div>

              {/* Event poster visual on the right */}
              <motion.div
                className="hero-poster"
                initial={{ opacity: 0, scale: 0.92, rotate: 2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", damping: 18 }}
                onClick={() => handleBook(heroEvent)}
                style={{ cursor: "pointer" }}
              >
                <EventPoster event={heroEvent} />
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Dots Indicator */}
          <div className="dots">
            {featured.map((item, i) => (
              <button
                key={item.id || i}
                className={i === heroIdx ? "on" : ""}
                onClick={() => setHeroIdx(i)}
                aria-label={`Go to slide ${i + 1}`}
                id={`hero-dot-${i}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <div className="wrap">
        {/* Category Filter Chips */}
        <div className="chips" id="category-chips">
          {categories.map((c) => (
            <button
              key={c.id}
              className={`chip${activeCat === c.id ? " on" : ""}`}
              onClick={() => setActiveCat(c.id)}
              id={`cat-chip-${c.id}`}
            >
              <span>{c.icon} {c.label}</span>
            </button>
          ))}
        </div>

        {/* ── RAIL 1: TRENDING IN CITY ── */}
        <Rail
          title={cityEvents.length > 0 ? `🔥 Trending Now in ${city}` : `🔥 Trending Events (${activeCat.toUpperCase()})`}
          sub={cityEvents.length > 0 ? `${cityEvents.length} events near you` : `Showing ${allEvents.filter((e) => activeCat === "all" || e.category === activeCat).length} popular events across India`}
          link={<Link to="/events" className="link-btn">See all →</Link>}
        >
          {(cityEvents.length > 0
            ? cityEvents
            : allEvents.filter((e) => activeCat === "all" || e.category === activeCat)
          ).map((ev) => (
            <EventCard key={ev.id} event={ev} onClick={handleBook} />
          ))}
        </Rail>

        {/* ── RAIL 2: OFFERS ── */}
        <Rail
          title="🏷️ Offers for you"
          sub="Tap a code to copy it"
        >
          {OFFERS.map((o) => (
            <button
              key={o.code}
              className="offer"
              style={{ background: o.bg }}
              onClick={() => copyOffer(o.code)}
              id={`offer-${o.code}`}
              title="Click to copy coupon code"
            >
              <b>{o.title}</b>
              <span>{o.desc}</span>
              <code>{copied === o.code ? "COPIED! ✓" : o.code}</code>
            </button>
          ))}
        </Rail>

        {/* ── RAIL 3: MUSIC & CONCERTS ── */}
        <Rail
          title="🎵 Music & Concerts"
          sub="Live stadium tours & acoustic sets across India"
          link={<Link to="/events?cat=music" className="link-btn">View all →</Link>}
        >
          {allEvents.filter((e) => e.category === "music").map((ev) => (
            <EventCard key={ev.id} event={ev} onClick={handleBook} />
          ))}
        </Rail>

        {/* ── RAIL 4: SPORTS & CRICKET ── */}
        <Rail
          title="🏏 Sports & Cricket"
          sub="Live matches, tournaments & stadium action"
          link={<Link to="/events?cat=cricket" className="link-btn">View all →</Link>}
        >
          {allEvents.filter((e) => ["cricket", "sports"].includes(e.category)).map((ev) => (
            <EventCard key={ev.id} event={ev} onClick={handleBook} />
          ))}
        </Rail>

        {/* ── RAIL 5: DJ & NIGHTLIFE ── */}
        <Rail
          title="🎧 DJ & Nightlife"
          sub="Club nights, EDM festivals & beach sunsets"
          link={<Link to="/events?cat=dj" className="link-btn">View all →</Link>}
        >
          {allEvents.filter((e) => e.category === "dj").map((ev) => (
            <EventCard key={ev.id} event={ev} onClick={handleBook} />
          ))}
        </Rail>

        {/* ── RAIL 6: FESTIVALS & COMEDY ── */}
        <Rail
          title="🎉 Festivals & Standup Comedy"
          sub="Cultural spectacles and laugh-out-loud specials"
          link={<Link to="/events?cat=festival" className="link-btn">View all →</Link>}
        >
          {allEvents.filter((e) => ["festival", "comedy"].includes(e.category)).map((ev) => (
            <EventCard key={ev.id} event={ev} onClick={handleBook} />
          ))}
        </Rail>

        {/* ── RAIL 7: COMING SOON ── */}
        <Rail
          title="📅 Coming Soon"
          sub="Register early before tickets go live"
        >
          {allEvents.filter((e) => e.filledPct < 0.6).map((ev) => (
            <EventCard key={ev.id} event={ev} onClick={handleBook} />
          ))}
        </Rail>
      </div>
    </main>
  );
}
