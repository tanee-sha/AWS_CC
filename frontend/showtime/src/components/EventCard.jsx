import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Event "poster" art using SVG — matching the original poster component style
const CAT_COLORS = {
  music:   { bg: ["#6d28d9","#a855f7"], icon: "🎵" },
  cricket: { bg: ["#065f46","#10b981"], icon: "🏏" },
  sports:  { bg: ["#1e3a8a","#3b82f6"], icon: "⚽" },
  dj:      { bg: ["#4c1d95","#7c3aed"], icon: "🎧" },
  festival:{ bg: ["#92400e","#f59e0b"], icon: "🎉" },
  comedy:  { bg: ["#78350f","#d97706"], icon: "😂" },
};

export function EventPoster({ event, className = "" }) {
  const cat = CAT_COLORS[event.category] || CAT_COLORS.music;
  const dateStr = new Date(event.date).toLocaleDateString("en-IN", { day:"numeric", month:"short" });

  return (
    <div className={`poster ${className}`}>
      <svg className="poster-svg" viewBox="0 0 300 420" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id={`g-${event.id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={cat.bg[0]}/>
            <stop offset="1" stopColor={cat.bg[1]}/>
          </linearGradient>
        </defs>
        <rect width="300" height="420" fill={`url(#g-${event.id})`}/>
        <rect width="300" height="420" fill="url(#vignette)" opacity=".4"/>
        {/* Big icon */}
        <text x="150" y="200" textAnchor="middle" dominantBaseline="middle" fontSize="120" opacity=".25">{cat.icon}</text>
        {/* Title */}
        <text x="150" y="290" textAnchor="middle" fontFamily="Poppins,sans-serif" fontWeight="700" fontSize="18" fill="#fff" opacity=".95">{event.title.slice(0,22)}{event.title.length>22?"…":""}</text>
        {/* Date */}
        <text x="150" y="316" textAnchor="middle" fontFamily="Poppins,sans-serif" fontSize="13" fill="#fff" opacity=".75">{dateStr} · {event.city}</text>
        {/* Price */}
        <text x="150" y="388" textAnchor="middle" fontFamily="Poppins,sans-serif" fontWeight="600" fontSize="15" fill="#fff">from ₹{event.price.toLocaleString()}</text>
      </svg>
      {event.filledPct > 0.85 && (
        <div className="poster-tag">FILLING FAST</div>
      )}
    </div>
  );
}

// Small card used in rails
export default function EventCard({ event, onClick }) {
  const fillPct = Math.round(event.filledPct * 100);
  const fillLabel = event.filledPct > 0.9 ? "Almost full" : event.filledPct > 0.7 ? "Filling fast" : `${fillPct}% filled`;
  const dateStr = new Date(event.date).toLocaleDateString("en-IN", { day:"numeric", month:"short" });

  return (
    <div className="mcard" onClick={() => onClick(event)} id={`event-card-${event.id}`} style={{cursor:"pointer"}}>
      <div className="mcard-img">
        <EventPoster event={event} />
        <div className="rate-bar">
          <span>⭐ {event.rating}</span>
          <em>{event.votes.toLocaleString()} reviews</em>
        </div>
      </div>
      <h4>{event.title}</h4>
      <p>{event.category} · {dateStr} · {event.city}</p>
      <p style={{fontSize:12,color:"var(--mut)",marginTop:2}}>from ₹{event.price.toLocaleString()}</p>
    </div>
  );
}
