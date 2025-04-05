import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getLoggedIn, getItemDetails, submitRating, submitReview } from "../api";
import Navbar from "../components/NavBar";
import "../css/Item.css"
import ListPersonThumbnail from "../components/ListPersonThumbnail";

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

const Item = () => {
    const navigate = useNavigate();
    const { itemId } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRatingPopupOpen, setIsRatingPopupOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [isReviewPopupOpen, setIsReviewPopupOpen] = useState(false);
    const [userReviewText, setUserReviewText] = useState("");
    const [hoverRating, setHoverRating] = useState(0);
    const [loggedInData, setLoggedInData] = useState({loggedIn: false, userName: ""});

    useEffect(() => {
        const checkStatus = async () => {
            getLoggedIn().then(data => { 
                if (!data.loggedIn) navigate("/login");
                setLoggedInData(data);
            });
        };
        checkStatus();
    }, [navigate]);

    useEffect(() => {
        const fetchItemDetails = async () => {
            setLoading(true);
            const data = await getItemDetails(itemId);
            setItem(data);
            if (data && data.user_rating) setRating(data.user_rating);
            setLoading(false);
        };
        fetchItemDetails();
    }, [itemId]);

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="loading" style={{marginTop: '120px'}}>Loading...</div>
            </>
        )
    }

    if (!item) {
        return (
            <>
                <Navbar />
                <div className="error" style={{marginTop: '120px'}}>Item {itemId} details not found</div>
            </>
        );
    }

    return (
        <>
            <Navbar isLoggedIn={loggedInData.loggedIn} userName={loggedInData.userName} />

            <Popup isOpen={isRatingPopupOpen} onClose={() => setIsRatingPopupOpen(false)}>
                <div className="popup-header">
                    <p style={{textAlign: 'center'}}>RATE THIS</p>
                    <h2 >{item.title}</h2>
                </div>
                <div className="popup-body">
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                        {[...Array(10)].map((_, index) => 
                            ( <span key={index} style={{
                                        cursor: 'pointer',
                                        fontSize: '30px',
                                        padding: '5px',
                                        color: index < (hoverRating || rating) ? '#FFD700' : '#FFD700',
                                        opacity: index < (hoverRating || rating) ? 1 : 0.3
                                    }}
                                    onMouseEnter={() => setHoverRating(index + 1)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(index + 1)}
                                > ★ </span> )
                        )}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button className="submit-rate-button" onClick={() => {setIsRatingPopupOpen(false); submitRating(rating);}}>
                            Rate
                        </button>
                    </div>
                </div>
            </Popup>

            <Popup isOpen={isReviewPopupOpen} onClose={() => setIsReviewPopupOpen(false)}>
                <div className="popup-header">
                    <p style={{textAlign: 'center'}}>GIVE REVIEW</p>
                    <h2 >{item.title}</h2>
                </div>
                <div className="popup-body">
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                        {[...Array(10)].map((_, index) => 
                            ( <span key={index} style={{
                                        cursor: 'pointer',
                                        fontSize: '30px',
                                        padding: '5px',
                                        color: index < (hoverRating || rating) ? '#FFD700' : '#FFD700',
                                        opacity: index < (hoverRating || rating) ? 1 : 0.3
                                    }}
                                    onMouseEnter={() => setHoverRating(index + 1)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(index + 1)}
                                > ★ </span> )
                        )}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                        <textarea 
                            className="review-input" 
                            placeholder="Review"
                            value={userReviewText}
                            required
                            onChange={(e) => setUserReviewText(e.target.value)}
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button className="submit-rate-button" onClick={() => {if (userReviewText.length > 0) {setIsReviewPopupOpen(false); submitReview(userReviewText);} else {alert("Review cannot be empty");}}}>
                            Submit
                        </button>
                    </div>
                </div>
            </Popup>

            <div className="item-page">
                {item.type === "tvseries" && (
                    <>
                        <div className="item-header" style={{display: 'flex', cursor: 'pointer'}} onClick={()=> navigate(`/item/${item.id}/episodes`)}>
                            <p style={{textDecoration: 'none'}} onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>Episode Guide</p>
                            <p className="forward-arrow" style={{marginLeft: '10px', marginTop: '19px'}}></p>
                        </div>
                    </>
                )}
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
                            <span>&nbsp;·&nbsp;</span>
                            <span>{item.country}</span>
                        </div>
                    </div>
                    <div className="item-sidebar">
                        <div className="rating-section">
                            <div className="mangodb-rating">
                                <div className="star-rating" style={{display: 'flex', margin: '20px'}}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px'}}>
                                    <img src="/rotten-mangoes.png" alt="Logo" style={{width: "30px"}}>
                                    </img>
                                        <span className="rating-value" style={{fontSize: '24px'}}>96%</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mangodb-rating">
                                <h4 style={{fontSize: '15px', fontWeight: 'bold', width: '150px'}} >PUBLIC RATING</h4>
                                <div className="star-rating">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <span className="star">★</span>
                                        <span className="rating-value">{item.rating}/10</span>
                                    </div>
                                    <span className="rating-count">{parseInt(item.numRating) >= 1000000 ? ( Math.floor(parseInt(item.numRating)/100000)/10 + ' M') : ( parseInt(item.numRating) >= 1000 ? (  Math.floor(parseInt(item.numRating)/100)/10 + ' K') : (item.numRating) )}</span>
                                </div>
                            </div>
                            
                            <div className="your-rating">
                                <h4 style={{fontSize: '15px', fontWeight: 'bold', width: '120px'}} >YOUR RATING</h4>
                                <div className="rate-button">
                                    <button className="rate-button">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }} onClick={() => setIsRatingPopupOpen(true)}>
                                            { rating > 0 ? (
                                                <>
                                                    <span className="star-outline">★</span>
                                                    <span style={{ fontSize: '20px', color: 'white', fontWeight: 'bold'}}>{rating}/10</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="star-outline">☆</span>
                                                    <span style={{ fontSize: '16px', marginTop: '5px' }}>Rate</span>
                                                </>
                                            )}
                                        </div>
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
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "/mangodb-logo.png"; // Fallback image
                                    }}
                                />
                            </div>
                            <div className="item-trailer">
                                <iframe 
                                    width="100%" 
                                    height="100%" 
                                    src={item.trailerLink.replace('watch?v=', 'embed/')} 
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>

                        <div className="item-genres">
                            {item.tags.map((genre, index) => (
                                <span key={index} className="genre-tag" onClick={() => navigate(`/genre/${genre.id}`, {state: {name: genre.name}})}>{genre.name}</span>
                            ))}
                        </div>

                        <div className="item-description">
                            <p>{item.description}</p>
                        </div>

                        <div className="item-crew">
                            <div className="crew-section">
                                <h3>Director</h3>
                                <p className="crew-name" style={{marginLeft: '16px'}} onClick={() => navigate(`/person/${item.director.id}`)}>{item.director.name}</p>
                            </div>
                            
                            { item.writers.length > 0 && (
                                <div className="crew-section">
                                    <h3>Writers</h3>
                                    <p className="crew-name" style={{marginLeft: '16px'}} onClick={() => navigate(`/person/${item.writers[0].id}`)}>{item.writers[0].name}</p>
                                    { item.writers.slice(1, 5).map(writer => (
                                        <>
                                            <p className="crew-name" onClick={() => navigate(`/person/${writer.id}`)}>&nbsp;·&nbsp;{writer.name}</p>
                                        </>
                                    ))}
                                    <p className="forward-arrow" style={{marginLeft: 'auto', marginRight: '16px', marginTop: '5px'}} onClick={() => navigate(`/items/${item.id}/list-persons/writers`, {state: {personHeaders: item.writers, title: item.title}})}></p>
                                </div>
                            )}
                            
                            { item.actors.length > 0 && (
                                <div className="crew-section">
                                    <h3>Stars</h3>
                                    <p className="crew-name" style={{marginLeft: '16px'}} onClick={() => navigate(`/person/${item.actors[0].id}`)}>{item.actors[0].name}</p>
                                    { item.actors.slice(1, 5).map(actor => (
                                        <>
                                            <p className="crew-name" onClick={() => navigate(`/person/${actor.id}`)}>&nbsp;·&nbsp;{actor.name}</p>
                                        </>
                                    ))}
                                    <p className="forward-arrow" style={{marginLeft: 'auto', marginRight: '16px', marginTop: '5px'}} onClick={() => navigate(`/items/${item.id}/list-persons/actors`, {state: {personHeaders: item.actors, title: item.title}})}></p>
                                </div>
                            )}

                            <div className="crew-section">
                                <h3>Production Company</h3>
                                <p className="crew-name" style={{marginLeft: '16px'}}>{item.productionCompany}</p>
                            </div>
                        </div>
                    </div>

                    
                </div>

                {item.actors.length > 0 && (
                    <ListPersonThumbnail title="Cast" titleFontSize="32px" personThumbnails={item.actors} />
                )}

                <div>
                    <div style={{display: 'flex'}}>
                        <h2 className="review-container-title" style={{marginRight: '25px'}}>User Reviews</h2>
                        <p className="forward-arrow" style={{marginTop: '50px'}} onClick={() => navigate(`/item/${item.id}/reviews`, {state: {title: item.title}})}></p>
                        <p style={{marginLeft: 'auto', marginRight: '16px', marginTop: '50px', fontSize: '20px', color: '#5799ef', cursor: 'pointer'}} onClick={() => setIsReviewPopupOpen(true)}><span style={{fontSize: '24px', fontWeight: '600', marginRight: '5px'}}>+</span> Review</p>
                    </div>
                    <div className="review-container">
                        {item.reviews.slice(0,3).map(review => (
                            <div key={review.id} className="review">
                                <div className="review-rating">
                                    <span className="star-outline" style={{marginRight: '8px'}}>★</span>
                                    {review.rating}/10
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