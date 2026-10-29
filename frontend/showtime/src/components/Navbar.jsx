import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { events as allEvents, cities } from "../data/events";

const POPULAR_CITIES = ["Mumbai","Delhi","Bengaluru","Hyderabad","Chennai","Kolkata","Pune","Ahmedabad"];
const OTHER_CITIES = ["Goa","Jaipur","Shillong","Indore"];

const CITY_ICONS = {
  Mumbai:"🏙️", Delhi:"🕌", Bengaluru:"🌳", Hyderabad:"🕍",
  Chennai:"🏖️", Kolkata:"🎨", Pune:"🎓", Ahmedabad:"🏛️",
  Goa:"🌊", Jaipur:"🏰", Shillong:"🌸", Indore:"🍛",
};

export default function Navbar({ city, setCity, user, setShowLogin }) {
  const [q, setQ] = useState("");
  const [showSuggest, setShowSuggest] = useState(false);
  const [showCity, setShowCity] = useState(false);
  const [cityQ, setCityQ] = useState("");
  const [showUser, setShowUser] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef();

  const suggestions = q.trim().length > 1
    ? allEvents.filter(e =>
        e.title.toLowerCase().includes(q.toLowerCase()) ||
        e.venue.toLowerCase().includes(q.toLowerCase()) ||
        e.city.toLowerCase().includes(q.toLowerCase())
      ).slice(0, 6)
    : [];

  const filteredCities = cities.filter(c => c.toLowerCase().includes(cityQ.toLowerCase()));

  return (
    <>
      <header className="hdr">
        <div className="hdr-top">
          {/* Logo */}
          <Link to="/" className="logo" id="nav-logo">
            <div className="logo-ic">🎫</div>
            show<b>time</b>
          </Link>

          {/* Search */}
          <div className="search" ref={searchRef}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              value={q}
              onChange={e => { setQ(e.target.value); setShowSuggest(true); }}
              onFocus={() => setShowSuggest(true)}
              onBlur={() => setTimeout(() => setShowSuggest(false), 150)}
              onKeyDown={e => {
                if (e.key === "Enter" && q.trim()) {
                  navigate(`/events?q=${encodeURIComponent(q.trim())}`);
                  setQ(""); setShowSuggest(false);
                }
              }}
              placeholder="Search for events, artists, venues..."
              id="nav-search-input"
            />
            <AnimatePresence>
              {showSuggest && (
                <motion.ul
                  className="suggest"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {suggestions.length > 0 ? suggestions.map(ev => (
                    <li key={ev.id} onMouseDown={() => { navigate(`/event/${ev.id}`); setQ(""); setShowSuggest(false); }}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{color:"var(--red)",flexShrink:0}}>
                        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                      </svg>
                      <div>
                        <span>{ev.title}</span>
                        <small>{ev.venue} · {ev.city}</small>
                      </div>
                    </li>
                  )) : (
                    <li className="none">
                      <span>No results for "{q}"</span>
                    </li>
                  )}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          {/* Right */}
          <div className="hdr-right">
            <button className="city-btn flex" onClick={() => setShowCity(true)} id="city-btn">
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24" style={{marginRight:4,color:"var(--red)"}}>
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              {city}
              <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24" style={{marginLeft:4}}>
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </button>

            {user ? (
              <div className="user">
                <button className="avatar" onClick={() => setShowUser(!showUser)} id="nav-user-btn">
                  {user.phone.slice(-2)}
                </button>
                <AnimatePresence>
                  {showUser && (
                    <motion.div className="user-menu" initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
                      <p>{user.phone}<small>Event Enthusiast</small></p>
                      <Link to="/my-tickets" onClick={() => setShowUser(false)}>🎫 My Tickets</Link>
                      <button onClick={() => { setShowUser(false); }}>Sign out</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button className="btn-signin" onClick={() => setShowLogin(true)} id="nav-signin-btn">
                Sign in
              </button>
            )}
          </div>
        </div>

        {/* Nav links */}
        <nav className="hdr-nav">
          <div>
            <Link to="/events?cat=music" className={""}>Live Events</Link>
            <Link to="/events?cat=cricket">Cricket</Link>
            <Link to="/events?cat=sports">Sports</Link>
            <Link to="/events?cat=dj">Nightlife</Link>
            <Link to="/events?cat=festival">Festivals</Link>
            <Link to="/events?cat=comedy">Comedy</Link>
          </div>
          <div>
            <a href="#">List Your Event</a>
            <a href="#">Corporates</a>
            <a href="#">Offers</a>
            <a href="#">Gift Cards</a>
          </div>
        </nav>
      </header>

      {/* City Modal */}
      <AnimatePresence>
        {showCity && (
          <motion.div className="modal-bg" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setShowCity(false)}>
            <motion.div className="modal wide" initial={{opacity:0,scale:.95,y:16}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0}} onClick={e => e.stopPropagation()}>
              <div className="city-head">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  value={cityQ}
                  onChange={e => setCityQ(e.target.value)}
                  placeholder="Search for your city"
                  autoFocus
                  id="city-search-input"
                />
              </div>
              <h4>Popular Cities</h4>
              <div className="city-grid">
                {POPULAR_CITIES.filter(c => c.toLowerCase().includes(cityQ.toLowerCase())).map(c => (
                  <button
                    key={c}
                    className={`city-tile${city === c ? " on" : ""}`}
                    onClick={() => { setCity(c); setShowCity(false); setCityQ(""); }}
                    id={`city-tile-${c.toLowerCase()}`}
                  >
                    <span>{CITY_ICONS[c] || "🏙️"}</span>
                    {c}
                  </button>
                ))}
              </div>
              <h4>Other Cities</h4>
              <div className="city-list">
                {OTHER_CITIES.filter(c => c.toLowerCase().includes(cityQ.toLowerCase())).map(c => (
                  <button key={c} onClick={() => { setCity(c); setShowCity(false); setCityQ(""); }} id={`city-btn-${c.toLowerCase()}`}>{c}</button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
