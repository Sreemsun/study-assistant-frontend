import { useState, useEffect } from "react";
import Login from "./components/Login";
import Chatbot from "./components/Chatbot";
import "./App.css";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check login status on page reload
  useEffect(() => {
    const savedAuth = localStorage.getItem("auth");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Called when user clicks Sign In
  const handleLogin = () => {
    localStorage.setItem("auth", "true");
    setIsAuthenticated(true);
  };

  // Called when user clicks Logout
  const handleLogout = () => {
    localStorage.removeItem("auth");
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen">
      {!isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Chatbot onLogout={handleLogout} />
      )}
    </div>
  );
}
