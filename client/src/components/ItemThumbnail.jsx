import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import "../css/ItemThumbnail.css";

const ItemThumbnail = ({ itemId, title, image, year, rating}) => {
    const navigate = useNavigate();
    return (
        <>
            <div 
                key={itemId} 
                className="ItemThumbnail-item-thumbnail"
                onClick={() => navigate(`/item/${itemId}`)}
            >
                <img 
                    src={image} 
                    alt={title}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/mangodb-logo.png";
                    }}
                />
                <h4>{title}</h4>
                <p>{year}</p>
                <p>Rating: {rating}/10</p>
            </div>
        </>
    )
}

export default ItemThumbnail;