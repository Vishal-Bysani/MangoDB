import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getLoggedIn, getItemDetails, submitRating, submitReview, setFavourite, toggleWatchListed } from "../api";
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
    const [directors, setDirectors] = useState([]);
    const [writers, setWriters] = useState([]);
    const [watchListed, setWatchListed] = useState(false);
    useEffect(() => {
        getLoggedIn().then(response => {
            if (response.status === 200) {
                response.json().then(data => {
                    setLoggedInData(data);
                });
            }
        });
    }, []);

    useEffect(() => {
        const fetchItemDetails = async () => {
            setLoading(true);
            const data = await getItemDetails(itemId);
            setItem(data);
            if (data && data.user_rating) setRating(data.user_rating);
            if (data.crew) {
                setDirectors(data.crew.filter(crew => crew.job_title === "Director"));
                setWriters(data.crew.filter(crew => crew.department_name === "Writing"));
            }
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
            <Navbar isLoggedIn={loggedInData.loggedIn} userName={loggedInData.username} />

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
                        <button className="submit-rate-button" onClick={() => {setIsRatingPopupOpen(false); submitRating(item.id, rating);}}>
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
                        <button className="submit-rate-button" onClick={() => {if (userReviewText.length > 0) {setIsReviewPopupOpen(false); submitReview(item.id, rating, userReviewText);} else {alert("Review cannot be empty");}}}>
                            Submit
                        </button>
                    </div>
                </div>
            </Popup>
            {/* Uncomment to apply backdrop image */}
            {/* <div className="item-page-container" style={{backgroundImage: `url(${item.backdrop})`}}> */}
            <div className="item-page-container">
                <div className="item-page">
                    {item.category === "tv" && (
                        <>
                            <div className="item-header" style={{display: 'flex', cursor: 'pointer'}} onClick={()=> navigate(`/item/${item.id}/episodes`)}>
                                <p style={{textDecoration: 'none'}} onMouseEnter={(e) => e.target.style.textDecoration = 'underline'} onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>Episode Guide</p>
                                <p className="forward-arrow" style={{marginLeft: '10px', marginTop: '19px'}}></p>
                            </div>
                        </>
                    )}
                    <div className="item-header-container">
                        <div className="item-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                                <h1 className="item-title">{item.title}</h1>
                                <button 
                                    className={`favourite-button ${item.favourite ? 'favourite-active' : ''}`}
                                    onClick={() => {
                                        if (loggedInData.loggedIn) {
                                            setFavourite(item.id, !item.favourite);
                                            setItem(prevItem => ({...prevItem, favourite: !prevItem.favourite}));
                                        } else {
                                            navigate("/login");
                                        }
                                    }}
                                    aria-label="Toggle favourite"
                                > ❤ </button>
                            </div>
                            <div className="item-metadata">
                                {item.category === "tv" ? (
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
                                { item.contentRating && 
                                    <>
                                        <span>{item.contentRating}</span> 
                                        <span>&nbsp;·&nbsp;</span> 
                                    </>
                                }
                                { item.duration && Math.floor(item.duration/60) > 0 ? (
                                    <>
                                        <span>{Math.floor(item.duration/60)}h {item.duration%60}m</span>
                                        <span>&nbsp;·&nbsp;</span>
                                    </>
                                ) : ( item.duration && 
                                    <>
                                        <span>{item.duration%60}m</span>
                                        <span>&nbsp;·&nbsp;</span>
                                    </>
                                )}
                                { item.country && 
                                    <>
                                        <span>{item.country}</span>
                                    </>
                                }
                            </div>
                        </div>
                        <div className="item-sidebar">
                            <div className="rating-section">
                                <div className="mangodb-rating">
                                    <div className="star-rating" style={{display: 'flex', margin: '20px'}}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px'}}>
                                        <img src="/rotten-mangoes.png" alt="Logo" style={{width: "30px"}}>
                                        </img>
                                            <span className="rating-value" style={{fontSize: '24px'}}>{item.rotten_mangoes}</span>
                                        </div>
                                        <span className="rating-count">{parseInt(item.rotten_mangoes_votes) >= 1000000 ? ( Math.floor(parseInt(item.rotten_mangoes_votes)/100000)/10 + ' M') : ( parseInt(item.rotten_mangoes_votes) >= 1000 ? (  Math.floor(parseInt(item.rotten_mangoes_votes)/100)/10 + ' K') : (item.rotten_mangoes_votes) )}</span>
                                    </div>
                                </div>
                                <div className="mangodb-rating">
                                    <h4 style={{fontSize: '15px', fontWeight: 'bold', width: '150px'}} >PUBLIC RATING</h4>
                                    <div className="star-rating">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <span className="star">★</span>
                                            <span className="rating-value">{parseFloat(item.rating).toFixed(1)}/10</span>
                                        </div>
                                        <span className="rating-count">{parseInt(item.numRating) >= 1000000 ? ( Math.floor(parseInt(item.numRating)/100000)/10 + ' M') : ( parseInt(item.numRating) >= 1000 ? (  Math.floor(parseInt(item.numRating)/100)/10 + ' K') : (item.numRating) )}</span>
                                    </div>
                                </div>
                                
                                <div className="your-rating">
                                    <h4 style={{fontSize: '15px', fontWeight: 'bold', width: '120px'}} >YOUR RATING</h4>
                                    <div className="rate-button">
                                        <button className="rate-button">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }} onClick={(e) => {
                                                    if (loggedInData.loggedIn) {
                                                        setIsRatingPopupOpen(true);
                                                    } else {
                                                        const tooltip = document.createElement("div");
                                                        tooltip.className = "login-alert-tooltip";
                                                        tooltip.textContent = "You need to log in to rate this item.";
                                                        tooltip.style.top = `${e.clientY + 20}px`;
                                                        tooltip.style.left = `${e.clientX - 30}px`;
                                                        document.body.appendChild(tooltip);

                                                        setTimeout(() => {
                                                            tooltip.remove();
                                                        }, 3000);
                                                    }
                                                }}>
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
                                        <span className="arrow">🔥</span>
                                        <span style={{marginTop: '5px', fontWeight: 'bold'}}>{parseFloat(item.popularity).toFixed(1)}</span>
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
                                        src={item.image ? item.image : "/item-backdrop.svg"}
                                        alt={item.title} 
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "/item-backdrop.svg"; // Fallback image
                                        }}
                                    />
                                    <button className="ItemThumbnail-plus-button" style={{width: '60px', height: '60px'}} onClick={(e) => { e.stopPropagation(); if (loggedInData.loggedIn) { setWatchListed(!watchListed); toggleWatchListed(itemId, !watchListed); } }} aria-label="Add to list">
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
                                <div className="item-trailer">
                                    <iframe 
                                        width="100%" 
                                        height="100%" 
                                        src={item.video && item.video.find(v => v.type === "Trailer") ? item.video.find(v => v.type === "Trailer").video.replace('watch?v=', 'embed/') : "https://www.youtube.com/embed/dQw4w9WgXcQ"} 
                                        title="YouTube video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>

                            { item.tags && <div className="item-genres">
                                {item.tags.map((genre, index) => (
                                    <span key={index} className="genre-tag" onClick={() => navigate(`/genre/${genre.genre_id}`, {state: {name: genre.genre_name}})}>{genre.genre_name}</span>
                                ))}
                            </div> }

                            { item.description && <div className="item-description">
                                <p>{item.description}</p>
                            </div> }

                            <div className="item-crew">
                                { directors.length > 0 && 
                                    <div className="crew-section">
                                        <h3>Directors</h3>
                                        <p className="crew-name" style={{marginLeft: '16px'}} onClick={() => navigate(`/person/${directors[0].id}`)}>{directors[0].name}</p>
                                        { directors.slice(1, 5).map(director => (
                                            <>
                                                <p className="crew-name" onClick={() => navigate(`/person/${director.id}`)}>&nbsp;·&nbsp;{director.name}</p>
                                            </>
                                        ))}
                                        <p className="forward-arrow" style={{marginLeft: 'auto', marginRight: '16px', marginTop: '5px'}} onClick={() => navigate(`/items/${item.id}/list-persons/writers`, {state: {personHeaders: item.writers, title: item.title}})}></p>
                                    </div>
                                }
                                
                                { writers.length > 0 && (
                                    <div className="crew-section">
                                        <h3>Writers</h3>
                                        <p className="crew-name" style={{marginLeft: '16px'}} onClick={() => navigate(`/person/${writers[0].id}`)}>{writers[0].name}</p>
                                        { writers.slice(1, 5).map(writer => (
                                            <>
                                                <p className="crew-name" onClick={() => navigate(`/person/${writer.id}`)}>&nbsp;·&nbsp;{writer.name}</p>
                                            </>
                                        ))}
                                        <p className="forward-arrow" style={{marginLeft: 'auto', marginRight: '16px', marginTop: '5px'}} onClick={() => navigate(`/items/${item.id}/list-persons/writers`, {state: {personHeaders: item.writers, title: item.title}})}></p>
                                    </div>
                                )}
                                
                                { item.cast && item.cast.length > 0 && (
                                    <div className="crew-section">
                                        <h3>Stars</h3>
                                        <p className="crew-name" style={{marginLeft: '16px'}} onClick={() => navigate(`/person/${item.cast[0].id}`)}>{item.cast[0].name}</p>
                                        { item.cast.slice(1, 5).map(actor => (
                                            <>
                                                <p className="crew-name" onClick={() => navigate(`/person/${actor.id}`)}>&nbsp;·&nbsp;{actor.name}</p>
                                            </>
                                        ))}
                                        <p className="forward-arrow" style={{marginLeft: 'auto', marginRight: '16px', marginTop: '5px'}} onClick={() => navigate(`/items/${item.id}/list-persons/actors`, {state: {personHeaders: item.cast, title: item.title}})}></p>
                                    </div>
                                )}
                                        {item.productionCompany && item.productionCompany.length > 0 && (
                                        <div className="crew-section">
                                            <h3>Production Company</h3>
                                            <p className="crew-name" style={{ marginLeft: '16px' }}>
                                            {item.productionCompany[0].name}
                                            </p>
                                        </div>
                                        )}

                            </div>
                        </div>
                        
                    </div>

                    {item.cast && item.cast.length > 0 && (
                        <ListPersonThumbnail title="Cast" titleFontSize="32px" personThumbnails={item.cast} />
                    )}

                    <div style={{display: 'flex'}}>
                        <h2 className="review-container-title" style={{marginRight: '25px'}}>User Reviews</h2>
                        <p className="forward-arrow" style={{marginTop: '50px'}} onClick={() => navigate(`/item/${item.id}/reviews`, {state: {title: item.title, reviews: item.reviews}})}></p>
                        <p style={{marginLeft: 'auto', marginRight: '16px', marginTop: '50px', fontSize: '20px', color: '#5799ef', cursor: 'pointer'}} onClick={(e) => {
                            if (loggedInData.loggedIn) {
                                setIsReviewPopupOpen(true);
                            } else {
                                const tooltip = document.createElement("div");
                                tooltip.className = "login-alert-tooltip";
                                tooltip.textContent = "You need to log in to review this item.";
                                tooltip.style.top = `${e.clientY + 20 + window.scrollY}px`;
                                tooltip.style.left = `${e.clientX - 30}px`;
                                document.body.appendChild(tooltip);

                                setTimeout(() => {
                                    tooltip.remove();
                                }, 3000);
                            }
                        }}><span style={{fontSize: '24px', fontWeight: '600', marginRight: '5px'}}>+</span> Review</p>
                    </div>
                    {item.reviews && item.reviews.length > 0 && <div>
                        <div className="review-container">
                            {item.reviews.slice(0,3).map(review => (
                                <div key={review.id} className="review">
                                    <div className="review-rating">
                                        <span className="star-outline" style={{marginRight: '8px'}}>★</span>
                                        {parseFloat(review.rating).toFixed(1)}/10
                                    </div>
                                    <div className="review-text">
                                        {review.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>}
                </div>
            </div>
        </>
    );
}

export default Item;