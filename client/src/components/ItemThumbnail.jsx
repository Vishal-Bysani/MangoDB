import React, { forwardRef, useState } from "react";
import { useNavigate } from "react-router";
import { toggleWatchListed } from "../api";
import "../css/ItemThumbnail.css";

const ItemThumbnail = forwardRef(({ itemId, title, image, year, rating, userRating, startYear, endYear, cast, crew, isWatchListed, loggedIn }, ref) => {
    const navigate = useNavigate();
    const [watchListed, setWatchListed] = useState(isWatchListed);
    
    return (
        <>
            <div 
                key={itemId} 
                className="ItemThumbnail-item-thumbnail"
                onClick={() => navigate(`/item/${itemId}`)}
                ref={ref}
            >
                <div className="ItemThumbnail-image-container">
                    <img 
                        src={image ? image : "/item-backdrop.svg"}
                        alt={title}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/item-backdrop.svg";
                        }}
                    />
                    <button className="ItemThumbnail-plus-button" onClick={(e) => { e.stopPropagation(); if (loggedIn) { setWatchListed(!watchListed); toggleWatchListed(itemId, !watchListed); } else { navigate("/login"); } }} aria-label="Add to list">
                        { !watchListed ? 
                            <p style={{fontSize: '20px', color: 'white'}}>+</p>
                        :
                            <div className="ItemThumbnail-tick-icon">
                                <svg 
                                    width="16" 
                                    height="16" 
                                    viewBox="0 0 24 24" 
                                    fill="none" 
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path 
                                        d="M20 6L9 17L4 12" 
                                        stroke="#00e6c3" 
                                        strokeWidth="3" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                        }
                    </button>
                </div>
                <div className="ItemThumbnail-rating-container">
                    { rating && <p style={{fontWeight: 'bold'}}><span className="ItemThumbnail-yellow-star">★</span> {parseFloat(rating).toFixed(1)}/10</p> }
                    { userRating > 0 && <p style={{fontWeight: 'bold'}}><span className="ItemThumbnail-blue-star">★</span> {parseFloat(userRating).toFixed(1)}/10</p> }
                </div>
                <h4>{title}</h4>
                { year && <p style={{fontWeight: 'bold'}}>{year}</p> }
                { startYear && !endYear && <p style={{fontWeight: 'bold'}}>{startYear}</p> }
                { startYear && endYear && <p style={{fontWeight: 'bold'}}>{startYear} - {endYear}</p> }
                { cast && <p style={{fontWeight: 'bold'}}>{cast.slice(0, 2).map(c => c.name).join(', ')}</p> }
            </div>
        </>
    )
})

export default ItemThumbnail;