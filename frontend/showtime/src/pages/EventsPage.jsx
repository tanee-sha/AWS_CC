import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { events as allEvents, categories, cities } from "../data/events";
import EventCard from "../components/EventCard";

export default function EventsPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const initCat = params.get("cat") || "all";
  const initQ = params.get("q") || "";

  const [cat, setCat] = useState(initCat);
  const [city, setCity] = useState("All");
  const [q, setQ] = useState(initQ);
  const [sort, setSort] = useState("date");

  const filtered = allEvents
    .filter((e) => {
      if (cat !== "all" && e.category !== cat) return false;
      if (city !== "All" && e.city !== city) return false;
      if (q && !e.title.toLowerCase().includes(q.toLowerCase()) &&
          !e.venue.toLowerCase().includes(q.toLowerCase()) &&
          !e.city.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === "date") return new Date(a.date) - new Date(b.date);
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "popularity") return b.votes - a.votes;
      return 0;
    });

  return (
    <main className="wrap" style={{ paddingTop: 32, paddingBottom: 60 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: 6 }}>
          🎪 All Events
        </h1>
        <p style={{ color: "var(--text2)", fontSize: "0.88rem" }}>
          {filtered.length} events found across India
        </p>
      </div>

      {/* FILTERS */}
      <div className="filter-bar">
        {/* Search */}
        <div className="nav-search" style={{ flex: "0 0 260px", maxWidth: 260 }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search events…"
            id="events-search-input"
          />
        </div>

        {/* Category */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {categories.map((c) => (
            <button
              key={c.id}
              className={`filter-chip${cat === c.id ? " on" : ""}`}
              onClick={() => setCat(c.id)}
              id={`filter-cat-${c.id}`}
            >
              {c.icon} {c.label}
            </button>
          ))}
        </div>

        {/* City */}
        <select
          className="filter-select"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          id="filter-city-select"
        >
          <option value="All">All Cities</option>
          {cities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Sort */}
        <select
          className="filter-select"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          id="filter-sort-select"
        >
          <option value="date">Sort: Date</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="popularity">Most Popular</option>
        </select>
      </div>

      {/* GRID */}
      <AnimatePresence mode="popLayout">
        {filtered.length > 0 ? (
          <motion.div
            className="egrid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {filtered.map((ev) => (
              <motion.div
                key={ev.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <EventCard event={ev} onClick={(e) => navigate(`/event/${e.id}`)} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="emoji">🎭</div>
            <h3>No events found</h3>
            <p>Try adjusting your filters or search a different city.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
