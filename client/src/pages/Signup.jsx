import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router";
import { signupUser } from "../api";
import "../css/Signup.css";
import { getLoggedIn } from "../api";
import { currentLinkContext } from "../Context";

const Signup = () => {
  const navigate = useNavigate();
  const { currentLink, setCurrentLink } = useContext(currentLinkContext);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const data = getLoggedIn();
    if (data.loggedIn && currentLink) navigate(currentLink);
    else if (data.loggedIn) navigate(`/`);
    document.title = "Sign Up";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    signupUser(formData.username, formData.password, formData.email).then(response => {
      if (response.status === 200) {
        setMessage("Email successfully sent to your email address. Please verify your email to continue. Reload once done.");
      } else {
        setError(response.json().then(data => data.message));
      }
    }).catch(err => {
      setError("An error occurred. Please try again.");
      console.error("Signup error:", err);
    });
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Sign Up</h2>
        {error && <p className="error-message">{error}</p>}
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit} method="POST">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              pattern="^[^@]+$"
              title="Username should not contain '@'"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="signup-button">Sign Up</button>
        </form>
        <p className="login-link">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;