import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { apiUrl } from "../config/config";
import "../css/Signup.css";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
    //   TODO: Activate this code
    //   const response = await fetch(`${apiUrl}/signup`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(formData),
    //     credentials: "include", // Include cookies in the request
    //   });
      
    //   const data = await response.json();

      const response = {status: 400};
      const data = {message: "SignUp functionality under development"}

      if (response.status === 200) {
        navigate("/dashboard");
      } else {
        setError(data.message || "Signup failed.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Signup error:", err);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Sign Up</h2>
        {error && <p className="error-message">{error}</p>}
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