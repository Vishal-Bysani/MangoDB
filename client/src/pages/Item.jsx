import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getLoggedIn, getItemDetails } from "../api";
import Navbar from "../components/NavBar";
import "../css/Item.css"


const Item = () => {
    const navigate = useNavigate();
    const { itemId } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkStatus = async () => {
            getLoggedIn().then(loggedIn => { 
                if (!loggedIn) navigate("/login"); 
            });
        };
        checkStatus();
    }, [navigate]);

    useEffect(() => {
        const fetchItemDetails = async () => {
            setLoading(true);
            const data = await getItemDetails(itemId);
            setItem(data);
            setLoading(false);
        };
        fetchItemDetails();
    }, [itemId]);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!item) {
        return <div className="error">Item not found</div>;
    }

    return (
        <>
            <Navbar />
            <div className="item-page">
                <div className="item-header-container">
                    <div className="item-header">
                        <h1 className="item-title">{item.title}</h1>
                        <div className="item-metadata">
                            {item.type === "tvseries" ? (
                                <>
                                    <span>TV Series</span>
                                    <span>&nbsp;·&nbsp;</span>
                                    <span>{item.startYear}-{item.endYear}</span>
                                    <span>&nbsp;·&nbsp;</span>
                                </>
                            ) : (
                                <>
                                    <span>{item.startYear}</span>
                                    <span>&nbsp;·&nbsp;</span>
                                </>
                            )}
                            <span>{item.contentRating}</span>
                            <span>&nbsp;·&nbsp;</span>
                            {Math.floor(item.duration/60) > 0 ? (
                                <>
                                    <span>{Math.floor(item.duration/60)}h {item.duration%60}m</span>
                                </>
                            ) : (
                                <>
                                    <span>{item.duration%60}m</span>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="item-sidebar">
                        <div className="rating-section">
                            <div className="imdb-rating">
                                <h4 style={{fontSize: '15px', fontWeight: 'bold'}} >IMDb RATING</h4>
                                <div className="star-rating">
                                    <span className="star">★</span>
                                    <span className="rating-value">{item.rating}/10</span>
                                </div>
                                <span className="votes">{item.imdb_votes}</span>
                            </div>
                            
                            <div className="your-rating">
                                <h4 style={{fontSize: '15px', fontWeight: 'bold'}} >YOUR RATING</h4>
                                <div className="rate-button">
                                    <button className="rate-button">
                                        <span className="star-outline">☆</span>
                                        <span style={{ fontSize: '16px', marginTop: '5px' }}>Rate</span>
                                    </button>
                                </div>
                            </div>
                            
                            <div className="popularity">
                                <h4 style={{fontSize: '15px', fontWeight: 'bold'}} >POPULARITY</h4>
                                <div className="popularity-score">
                                    <span className="arrow">-</span>
                                    <span style={{marginTop: '5px'}}>{item.popularity}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="item-content">
                    <div className="item-main">
                        <div className="item-trailer-container">
                            <div className="item-poster">
                                <img 
                                    src={item.image} 
                                    alt={item.title} 
                                    className="search-result-image" 
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "/imdb-logo.svg"; // Fallback image
                                    }}
                                />
                            </div>
                            <div className="item-trailer">
                                <div className="play-button">
                                    <span className="play-icon">▶</span>
                                    <span>Play trailer</span>
                                    <span className="trailer-duration"></span>
                                </div>
                            </div>
                        </div>

                        <div className="item-genres">
                            {item.tags.map((tag, index) => (
                                <span key={index} className="genre-tag">{tag}</span>
                            ))}
                        </div>

                        <div className="item-description">
                            <p>{item.description}</p>
                        </div>

                        <div className="item-crew">
                            <div className="crew-section">
                                <h3>Director</h3>
                                <p>{item.director}</p>
                            </div>
                            
                            <div className="crew-section">
                                <h3>Writers</h3>
                                <p>{item.writers.join(" · ")}</p>
                            </div>
                            
                            <div className="crew-section">
                                <h3>Stars</h3>
                                <p>{item.actors.slice(0, 5).join(" · ")}</p>
                            </div>
                        </div>
                    </div>

                    
                </div>

                <div>
                    <h2 className="review-container-title">User Reviews</h2>
                    <div className="review-container">
                        {item.reviews.slice(0,3).map(review => (
                            <div key={review.id} className="review">
                                <div className="review-rating">
                                    <span className="star-outline">☆</span>
                                    {review.rating}/5
                                </div>
                                <div className="review-text">
                                    {review.text}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Item;