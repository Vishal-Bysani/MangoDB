import React, { forwardRef, useContext, useState } from "react";
import { useNavigate } from "react-router";
import { toggleWatchListed, toggleWantToReadListed } from "../api";
import "../css/ItemOverview.css";
import { loggedInDataContext, currentLinkContext } from "../Context";

const ItemOverview = forwardRef(({ itemId, title, image, year, rating, userRating, startYear, endYear, cast, author, description, forBook = false, isWatchOrReadList = false, type }, ref) => {
    const {loggedInData, setLoggedInData} = useContext(loggedInDataContext);
    const {currentLink, setCurrentLink} = useContext(currentLinkContext);
    const navigate = useNavigate();
    const [watchListed, setWatchListed] = useState(isWatchOrReadList);
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
                        onClick={() => { if (forBook) navigate(`/book/${itemId}`); else navigate(`/item/${itemId}`); }}
                    />
                    <button className="ItemThumbnail-plus-button" style={{width: '50px', height: '50px'}} onClick={(e) => { e.stopPropagation(); if (loggedInData.loggedIn && forBook) { setWatchListed(!watchListed); toggleWantToReadListed(itemId, !watchListed); } else if (loggedInData.loggedIn) { setWatchListed(!watchListed); toggleWatchListed(itemId, !watchListed); } else { navigate("/login"); } }} aria-label="Add to list">
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
                    <p onClick={() => { if (forBook) navigate(`/book/${itemId}`); else navigate(`/item/${itemId}`); }} style={{ cursor: "pointer", fontSize: "36px", fontWeight: "bolder", color: "#10e3a5", marginBottom: "10px" }}>{title}</p>
                    <div className="item-overview-rating-container">
                        <p style={{fontWeight: 'bold'}}><span className="item-overview-yellow-star">★</span> {parseFloat(rating).toFixed(1)}/10</p>
                        { userRating > 0 && <p style={{fontWeight: 'bold'}}><span className="item-overview-blue-star">★</span> {parseFloat(userRating).toFixed(1)}/10</p> }
                        <span className="item-overview-type" style={{
                            backgroundColor: forBook ? '#ff4d4d' : (type === 'tv' ? '#4d94ff' : '#9933ff')
                        }}>{forBook ? "Book" : (type === "tv" ? "TV Show" : "Movie")}</span>
                    </div>
                    { year && <p>{year}</p> }
                    { startYear && endYear && <p>{startYear} - {endYear}</p> }
                    { cast && cast.length > 0 && <p>{cast.slice(0, 4).map(c => c.name).join(', ')}</p> }
                    { author && <p>{author}</p> }
                    { description && description.length < 500 && <p style={{marginTop: "10px", fontSize: "18px", fontWeight: "normal"}}>{description}</p>}
                    { description && description.length >= 500 && 
                        <p style={{marginTop: "10px", fontSize: "18px", fontWeight: "normal"}}>{description.slice(0, 500)} <span style={{color: "#00e6c3", fontWeight: "bold", cursor: "pointer"}} onClick={() => { if (forBook) navigate(`/book/${itemId}`); else navigate(`/item/${itemId}`); }}>. . .</span></p>
                    }
                </div>
            </div>
        </div>
    )
})

export default ItemOverview;