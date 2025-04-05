import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { apiUrl } from "../config/config";
import "../css/Login.css";
import { getLoggedIn, loginUser } from "../api";

const Login = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkStatus = async () => {
            getLoggedIn().then(loggedInData => {
                if (loggedInData.loggedIn) navigate("/dashboard");
            });
        };
        checkStatus();
    }, []);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        loginUser(formData.email, formData.password).then(response => {
            if (response.status === 200) {
                navigate("/dashboard");
            } else {
                setError(response.json().then(data => data.message));
            }
        });
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Sign In</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit} method="POST">
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
                    <button type="submit" className="login-button">Login</button>
                </form>
                <p className="signup-link">
                    Don't have an account? <a href="/signup">Sign up here</a>
                </p>
            </div>
        </div>
    );
};

export default Login;