import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import "../css/PersonThumbnail.css";

const PersonThumbnail = ({ personId, name, image, character }) => {
    const navigate = useNavigate();
    
    return (
        <div key={personId} className="person-thumbnail" onClick={() => navigate(`/person/${personId}`)}>
            <img 
                src={image ? image : "/mangodb-logo.png"} 
                alt={name}
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/mangodb-logo.png";
                }}
                />
            <h3>{name}</h3>
            {character && <h4>{character}</h4>}
        </div>
    )
}

export default PersonThumbnail;