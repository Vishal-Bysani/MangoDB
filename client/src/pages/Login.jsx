import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router";
import { apiUrl } from "../config/config";
import "../css/Login.css";
import { getLoggedIn, loginUser } from "../api";
import { currentLinkContext } from "../Context";

const Login = () => {
    const navigate = useNavigate();
    const {currentLink, setCurrentLink} = useContext(currentLinkContext);

    useEffect(() => {
        getLoggedIn().then(response => {
            if (response.status === 200) {
                response.json().then(data => {
                    if (data.loggedIn && currentLink) navigate(currentLink);
                    else if (data.loggedIn) navigate(`/`)
                });
            }
        });
    }, []);

    const [formData, setFormData] = useState({
        user: "",
        password: "",
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        loginUser(formData.user, formData.password).then(response => {
            if (response.status === 200) {
                if (currentLink) navigate(currentLink);
                else navigate("/");
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
                        <label htmlFor="email">Username or Email</label>
                        <input
                            type="text"
                            id="user"
                            name="user"
                            value={formData.user}
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