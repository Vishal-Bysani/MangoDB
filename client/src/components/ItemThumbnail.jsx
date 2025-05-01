import React, { forwardRef, useContext, useState } from "react";
import { useNavigate } from "react-router";
import { toggleWatchListed, toggleWantToReadListed } from "../api";
import "../css/ItemThumbnail.css";
import { loggedInDataContext, currentLinkContext } from "../Context";

const ItemThumbnail = forwardRef(({ itemId, title, image, year, rating, userRating, startYear, endYear, cast, isWatchListed, forBook }, ref) => {
    const navigate = useNavigate();
    const [watchListed, setWatchListed] = useState(isWatchListed);
    const {loggedInData, setLoggedInData} = useContext(loggedInDataContext);
    const {currentLink, setCurrentLink} = useContext(currentLinkContext);
    const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0 });
    
    return (
        <>
            <div 
                key={itemId} 
                className="ItemThumbnail-item-thumbnail"
                onClick={() => { if (forBook) navigate(`/book/${itemId}`); else navigate(`/item/${itemId}`); }}
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
                    <button
                        className="ItemThumbnail-plus-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (loggedInData.loggedIn && forBook) {
                                setWatchListed(!watchListed);
                                toggleWantToReadListed(itemId, !watchListed);
                            } else if (loggedInData.loggedIn) {
                                setWatchListed(!watchListed);
                                toggleWatchListed(itemId, !watchListed);
                            } else {
                                navigate("/login");
                            }
                        }}
                        aria-label="Add to list"
                        onMouseEnter={() => setTooltip(t => ({ ...t, visible: true }))}
                        onMouseMove={e => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setTooltip(t => ({
                                ...t,
                                x: e.clientX - rect.left,
                                y: e.clientY - rect.top
                            }));
                        }}
                        onMouseLeave={() => setTooltip(t => ({ ...t, visible: false }))}
                    >
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
                        {tooltip.visible && (
                            <div className="itemThumbnail-tooltip" style={{ left: tooltip.x + 10, top: tooltip.y + 10 }}>
                                {forBook ? "Add To Readlist" : "Add To Watchlist"}
                            </div>
                        )}
                    </button>
                </div>
                <div className="ItemThumbnail-rating-container">
                    { rating && <p style={{fontWeight: 'bold'}}><span className="ItemThumbnail-yellow-star">★</span> {parseFloat(rating).toFixed(1)}/10</p> }
                    { userRating > 0 && <p style={{fontWeight: 'bold'}}><span className="ItemThumbnail-blue-star">★</span> {parseFloat(userRating).toFixed(1)}/10</p> }
                </div>
                <h4>{title}</h4>
                { year && <p style={{fontWeight: 'bold'}}>{String(year).slice(0, 4)}</p> }
                { startYear && !endYear && <p style={{fontWeight: 'bold'}}>{startYear}</p> }
                { startYear && endYear && <p style={{fontWeight: 'bold'}}>{startYear} - {endYear}</p> }
                { cast && <p style={{fontWeight: 'bold'}}>{cast.slice(0, 2).map(c => c.name).join(', ')}</p> }
            </div>
        </>
    )
})

export default ItemThumbnail;