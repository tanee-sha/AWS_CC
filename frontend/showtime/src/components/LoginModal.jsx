import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginModal({ onClose, onSuccess }) {
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["","","","","",""]);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  const sendOtp = () => {
    if (phone.length < 10) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep("otp"); setCountdown(30); }, 900);
  };

  const handleOtpChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp]; next[i] = val; setOtp(next);
    if (val && i < 5) document.getElementById(`otp-${i+1}`)?.focus();
    if (next.every(d => d !== "")) verifyOtp(next.join(""));
  };

  const verifyOtp = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onSuccess({ phone: `+91 ${phone}` }); }, 1000);
  };

  return (
    <motion.div className="modal-bg" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose}>
      <motion.div className="modal" initial={{opacity:0,y:24,scale:.96}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0}} onClick={e => e.stopPropagation()}>
        <div className="login">
          <div className="login-art">🎫</div>
          {step === "phone" ? (
            <>
              <h3>Get Started</h3>
              <p className="muted">Sign in to book your event tickets</p>
              <div className="phone-in">
                <span>🇮🇳 +91</span>
                <input
                  type="tel" inputMode="numeric" maxLength={10}
                  placeholder="Enter mobile number"
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g,""))}
                  onKeyDown={e => e.key === "Enter" && sendOtp()}
                  id="login-phone-input"
                  autoFocus
                />
              </div>
              <button className="btn-primary full" onClick={sendOtp} disabled={loading || phone.length < 10} id="login-continue-btn">
                {loading ? "Sending OTP…" : "Continue"}
              </button>
              <small className="muted">By continuing you agree to our Terms & Privacy Policy</small>
            </>
          ) : (
            <>
              <h3>Verify OTP</h3>
              <p className="muted">Sent to +91 {phone}</p>
              <div className="otp">
                {otp.map((d, i) => (
                  <input
                    key={i} id={`otp-${i}`} value={d}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => { if (e.key === "Backspace" && !d && i > 0) document.getElementById(`otp-${i-1}`)?.focus(); }}
                    inputMode="numeric" maxLength={1}
                    autoFocus={i === 0}
                  />
                ))}
              </div>
              {loading && <p className="muted center">Verifying…</p>}
              <p className="muted center" style={{fontSize:13}}>
                {countdown > 0
                  ? <>Resend OTP in <b>{countdown}s</b></>
                  : <button className="link-btn" onClick={() => { setOtp(["","","","","",""]); setCountdown(30); }} id="resend-otp-btn">Resend OTP</button>}
              </p>
              <button style={{background:"none",border:"none",color:"var(--mut)",fontSize:13,marginTop:8,cursor:"pointer"}} onClick={() => setStep("phone")}>
                ← Change number
              </button>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
