import React from "react";
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import "../css/NotFound.css";
import { Ring, Grid } from 'ldrs/react'
import 'ldrs/react/Grid.css'


const NotFound = () => {
    const navigate = useNavigate();
    
    const handleGoHome = () => {
        navigate('/');
    };
    
    return (
        <div className="notfound-container">
            <Navbar />
            <div className="notfound-content">
                <div className="notfound-card">
                    <div className="notfound-header">
                        <h1 className="notfound-title">404</h1>
                        <div className="notfound-divider"></div>
                        <h2 className="notfound-subtitle">Page Not Found</h2>
                    </div>
                    
                    <div className="notfound-box">
                        <p className="notfound-message">
                            The page you are looking for might have been removed, 
                            had its name changed, or is temporarily unavailable.
                        </p>
                        
                        <button 
                            onClick={handleGoHome}
                            className="notfound-button"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;