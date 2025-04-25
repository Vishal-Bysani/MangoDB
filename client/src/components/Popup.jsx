import React from "react";

const Popup = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="popup-overlay" onClick={onClose}>
        <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close-btn" onClick={onClose}>×</button>
            {children}
        </div>
        </div>
    );
};

export default Popup;