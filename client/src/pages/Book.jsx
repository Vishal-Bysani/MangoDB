import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import { getBookDetails, getLoggedIn, submitRating, submitReview, setFavourite, toggleWantToReadListed } from "../api";
import "../css/Book.css";
import Popup from "../components/Popup"
import Loading from "../components/Loading"
import ListPersonThumbnail from "../components/ListPersonThumbnail"

const Book = () => {
    const navigate = useNavigate();
    const { bookId } = useParams();
    const [book, setBook] = useState({});
    const [loading, setLoading] = useState(true);
    const [isRatingPopupOpen, setIsRatingPopupOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [isReviewPopupOpen, setIsReviewPopupOpen] = useState(false);
    const [userReviewText, setUserReviewText] = useState("");
    const [hoverRating, setHoverRating] = useState(0);
    const [loggedInData, setLoggedInData] = useState({loggedIn: false, username: ""});
    const [authors, setAuthors] = useState([]);
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
        const fetchBookDetails = async () => {
            const data = await getBookDetails(bookId);
            setBook(data);
            if (data) {
                setAuthors(data.authors);
            }
            console.log(data)
            setLoading(false);
        }
        fetchBookDetails();
    }, [bookId])

    if (loading) {
        return (
            <>
                <Navbar isLoggedIn={loggedInData.loggedIn} username={loggedInData.username} />
                <Loading/>
            </>
        )
    }

    if (!book) {
        return (
            <>
                <Navbar />
                <div className="error" style={{marginTop: '120px'}}>Book {bookId} details not found</div>
            </>
        );
    }

    return (
        <>
            <Navbar isLoggedIn={loggedInData.loggedIn} username={loggedInData.username} />

            <Popup isOpen={isRatingPopupOpen} onClose={() => setIsRatingPopupOpen(false)}>
                <div className="popup-header">
                    <p style={{textAlign: 'center'}}>RATE THIS</p>
                    <h2 >{book.title}</h2>
                    
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
                        <button className="submit-rate-button" onClick={() => {setIsRatingPopupOpen(false); submitRating(bookId, rating, true);}}>
                            Rate
                        </button>
                    </div>
                </div>
            </Popup>

            <Popup isOpen={isReviewPopupOpen} onClose={() => setIsReviewPopupOpen(false)}>
                <div className="popup-header">
                    <p style={{textAlign: 'center'}}>GIVE REVIEW</p>
                    <h2 >{book.title}</h2>
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
                        <button className="submit-rate-button" onClick={() => {if (userReviewText.length > 0) {setIsReviewPopupOpen(false); submitReview(bookId, rating, userReviewText, true);} else {alert("Review cannot be empty");}}}>
                            Submit
                        </button>
                    </div>
                </div>
            </Popup>
            {/* Uncomment to apply backdrop image */}
            {/* <div className="item-page-container" style={{backgroundImage: `url(${book.backdrop})`}}> */}
            <div className="item-page-container">
                <div className="item-page">
                    <div className="item-header-container">
                        <div className="item-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                                <h1 className="item-title">{book.title}</h1>
                                <button 
                                    className={`favourite-button ${book.favourite ? 'favourite-active' : ''}`}
                                    onClick={() => {
                                        if (loggedInData.loggedIn) {
                                            setFavourite(bookId, !book.favourite, true);
                                            setBook(prevBook => ({...prevBook, favourite: !prevBook.favourite}));
                                        } else {
                                            navigate("/login", { state: { parentLink : `/book/${bookId}` }});
                                        }
                                    }}
                                    aria-label="Toggle favourite"
                                > ❤ </button>
                            </div>
                            <div className="item-metadata">
                                { book.page_count &&
                                    <>
                                        <span>{book.page_count} Pages</span>
                                    </>
                                }
                                { book.published_date &&
                                    <>
                                        <span>&nbsp;·&nbsp;</span> 
                                        <span>{book.published_date}</span>
                                    </>
                                }
                                { book.maturity_rating && 
                                    <>
                                        <span>&nbsp;·&nbsp;</span> 
                                        <span>{book.maturity_rating}</span> 
                                    </>
                                }
                                { book.country && 
                                    <>
                                        <span>&nbsp;·&nbsp;</span> 
                                        <span>{book.country}</span>
                                    </>
                                }
                            </div>
                        </div>
                        <div className="item-sidebar">
                            <div className="rating-section">
                                <div className="mangodb-rating">
                                    <h4 style={{fontSize: '15px', fontWeight: 'bold', width: '150px'}} >PUBLIC RATING</h4>
                                    <div className="star-rating">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <span className="star">★</span>
                                            <span className="rating-value">{parseFloat(book.vote_average).toFixed(1)}/10</span>
                                        </div>
                                        <span className="rating-count">{parseInt(book.vote_count) >= 1000000 ? ( Math.floor(parseInt(book.vote_count)/100000)/10 + ' M') : ( parseInt(book.vote_count) >= 1000 ? (  Math.floor(parseInt(book.vote_count)/100)/10 + ' K') : (book.vote_count) )}</span>
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
                                                        navigate("/login", { state: { parentLink : `/book/${bookId}` }});
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
                                        <span style={{marginTop: '5px', fontWeight: 'bold'}}>{parseFloat(book.popularity).toFixed(1)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="item-content">
                        <div className="item-main">
                            <div className="item-trailer-container">
                                    <img 
                                        src={book.image ? book.image : "/item-backdrop.svg"}
                                        alt={book.title} 
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "/item-backdrop.svg"; // Fallback image
                                        }}
                                        className="item-image"
                                    />
                                    <button className="ItemThumbnail-plus-button" style={{width: '60px', height: '60px'}} onClick={(e) => { e.stopPropagation(); if (loggedInData.loggedIn) { setWatchListed(!watchListed); toggleWantToReadListed(bookId, !watchListed, true); } else { navigate("/login", { state: { parentLink : `/book/${bookId}` }}); } }} aria-label="Add to list">
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
                                <div className="item-trailer">
                                    <iframe 
                                        width="100%" 
                                        height="100%" 
                                        src={book.video && book.video.find(v => v.type === "Trailer") ? book.video.find(v => v.type === "Trailer").video.replace('watch?v=', 'embed/') : "https://www.youtube.com/embed/dQw4w9WgXcQ"} 
                                        title="YouTube video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>

                            { book.genres && <div className="item-genres">
                                {book.genres.map((genre, index) => (
                                    <span key={index} className="genre-tag">{genre.name}</span>
                                ))}
                            </div> }

                            { book.overview && <div className="item-description">
                                <p>{book.overview}</p>
                            </div> }

                            <div className="item-crew">
                                { authors.length > 0 && 
                                    <div className="crew-section">
                                        <h3>Authors</h3>
                                        <p className="crew-name" style={{marginLeft: '16px'}} onClick={() => navigate(`/person/${authors[0].id}`)}>{authors[0].name}</p>
                                        { authors.slice(1, 5).map(author => (
                                            <>
                                                <p className="crew-name" onClick={() => navigate(`/person/${author.id}`)}>&nbsp;·&nbsp;{author.name}</p>
                                            </>
                                        ))}
                                        <p className="forward-arrow" style={{marginLeft: 'auto', marginRight: '16px', marginTop: '5px'}} onClick={() => navigate(`/items/${bookId}/list-persons/writers`, {state: {personHeaders: book.writers, title: book.title}})}></p>
                                    </div>
                                }

                                {book.publisher && (
                                    <div className="crew-section">
                                        <h3>Publisher</h3>
                                        <p className="crew-name" style={{ marginLeft: '16px' }}>
                                        {book.publisher}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                    </div>

                    <div style={{display: 'flex'}}>
                        <h2 className="review-container-title" style={{marginRight: '25px'}}>User Reviews</h2>
                        <p className="forward-arrow" style={{marginTop: '50px'}} onClick={() => navigate(`/book/${bookId}/reviews`, {state: {title: book.title, reviews: book.reviews}})}></p>
                        <p style={{marginLeft: 'auto', marginRight: '16px', marginTop: '50px', fontSize: '20px', color: '#5799ef', cursor: 'pointer'}} onClick={(e) => {
                            if (loggedInData.loggedIn) {
                                setIsReviewPopupOpen(true);
                            } else {
                                navigate("/login", { state: { parentLink : `/book/${bookId}` }});
                            }
                        }}><span style={{fontSize: '24px', fontWeight: '600', marginRight: '5px'}}>+</span> Review</p>
                    </div>
                    {book.reviews && book.reviews.length > 0 && <div>
                        <div className="review-container">
                            {book.reviews.slice(0,3).map(review => (
                                <>
                                    { review.text && <div key={review.id} className="review">
                                            <div className="review-rating">
                                                <span className="star-outline" style={{marginRight: '8px'}}>★</span>
                                                {parseFloat(review.rating).toFixed(1)}/10
                                            </div>
                                            <div className="review-text">
                                                {review.text}
                                            </div>
                                        </div>
                                    }
                                </>
                            ))}
                        </div>
                    </div>}
                </div>
            </div>
        </>
    )
}

export default Book;