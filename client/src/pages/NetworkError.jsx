import React from "react";
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import "../css/NetworkError.css";

const NetworkError = () => {
    const navigate = useNavigate();
    
    const handleRetry = () => {
        navigate(-1); // Go back to previous page
    };
    
    return (
        <div className="network-error-container">
            <Navbar />
            <div className="network-error-content">
                <div className="network-error-card">
                    <div className="network-error-header">
                        <h1 className="network-error-title">Network Error</h1>
                        <div className="network-error-divider"></div>
                        <h2 className="network-error-subtitle">Connection Lost</h2>
                    </div>
                    
                    <div className="network-error-box">
                        <p className="network-error-message">
                            We're having trouble connecting to our servers. 
                            Please check your internet connection and try again.
                        </p>
                        
                        <button 
                            onClick={handleRetry}
                            className="network-error-button"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NetworkError; 