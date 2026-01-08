import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // TODO: replace with real auth call
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 700);
  };

  return (
    <div className="login-wrapper">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.2, 0.9, 0.2, 1] }}
        className="login-card anim-in"
      >
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <h1 className="title">Welcome Back</h1>
          <p className="subtitle">Sign in to access your AI study assistant</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@school.edu"
              className="chat-input"
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="chat-input"
            />
          </div>

          <div className="actions">
            <button
              type="submit"
              className="send-btn"
              disabled={loading}
              aria-disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <button
              type="button"
              className="demo-btn"
              onClick={() => {
                setEmail("demo@user.com");
                setPassword("demo");
              }}
            >
              Demo Login
            </button>
          </div>
        </form>

        <div className="help" style={{ marginTop: 16 }}>
          <span className="small-muted">Need an account?</span>{" "}
          <button
            onClick={() => alert("Sign-up flow not implemented yet")}
            style={{ color: "var(--accent-1)", background: "transparent", border: "none", cursor: "pointer" }}
          >
            Create one
          </button>
        </div>
      </motion.div>
    </div>
  );
}
