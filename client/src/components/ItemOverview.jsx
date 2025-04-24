import React, { forwardRef, useState } from "react";
import { useNavigate } from "react-router";
import { toggleWatchListed } from "../api";
import "../css/ItemOverview.css";

const ItemOverview = forwardRef(({ itemId, title, image, year, rating, userRating, startYear, endYear, cast, crew , description, loggedIn }, ref) => {
    const navigate = useNavigate();
    const [watchListed, setWatchListed] = useState(false);
    return (
        <div className="item-overview-container" ref={ref}>
            <div className="item-overview-content">
                <div className="item-overview-image-container">
                    <img
                        src={image ? image : "/item-backdrop.svg"}
                        alt={title}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/item-backdrop.svg";
                        }}
                        className="item-overview-image"
                        onClick={() => navigate(`/item/${itemId}`)}
                    />
                    <button className="ItemThumbnail-plus-button" style={{width: '50px', height: '50px'}} onClick={(e) => { e.stopPropagation(); if (loggedIn) { setWatchListed(!watchListed); toggleWatchListed(itemId, !watchListed); } else { navigate("/login"); } }} aria-label="Add to list">
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
                <div className="item-overview-info-container">
                    <p onClick={() => navigate(`/item/${itemId}`)} style={{ cursor: "pointer", fontSize: "36px", fontWeight: "bolder", color: "#10e3a5", marginBottom: "10px" }}>{title}</p>
                    <div className="item-overview-rating-container">
                        <p style={{fontWeight: 'bold'}}><span className="item-overview-yellow-star">★</span> {parseFloat(rating).toFixed(1)}/10</p>
                        { userRating > 0 && <p style={{fontWeight: 'bold'}}><span className="item-overview-blue-star">★</span> {parseFloat(userRating).toFixed(1)}/10</p> }
                    </div>
                    { year && <p>{year}</p> }
                    { startYear && endYear && <p>{startYear} - {endYear}</p> }
                    { cast && cast.length > 0 && <p>{cast.slice(0, 4).map(c => c.name).join(', ')}</p> }
                    <p style={{marginTop: "10px", fontSize: "18px", fontWeight: "normal"}}>{description}</p>
                </div>
            </div>
        </div>
    )
})

export default ItemOverview;