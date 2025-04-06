import React, { useState, useEffect, useRef, forwardRef } from "react";
import { useNavigate } from "react-router";
import "../css/ItemThumbnail.css";

const ItemThumbnail = forwardRef(({ itemId, title, image, year, rating, userRating}, ref) => {
    const navigate = useNavigate();
    return (
        <>
            <div 
                key={itemId} 
                className="ItemThumbnail-item-thumbnail"
                onClick={() => navigate(`/item/${itemId}`)}
                ref={ref}
            >
                <img 
                    src={image ? image : "/mangodb-logo.png"} 
                    alt={title}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/mangodb-logo.png";
                    }}
                />
                <div className="ItemThumbnail-rating-container">
                    <p style={{fontWeight: 'bold'}}><span className="ItemThumbnail-yellow-star">★</span> {rating}/10</p>
                    { userRating > 0 && <p style={{fontWeight: 'bold'}}><span className="ItemThumbnail-blue-star">★</span> {userRating}/10</p> }
                </div>
                <h4>{title}</h4>
                <p style={{fontWeight: 'bold'}}>{year}</p>
            </div>
        </>
    )
})

export default ItemThumbnail;