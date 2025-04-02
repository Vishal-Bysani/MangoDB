import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getLoggedIn, getMovieDetails } from "../api";
import Navbar from "../components/NavBar";
import "../css/Movie.css"


const Movie = () => {
    const navigate = useNavigate();
    const { movieId } = useParams();
    const [movie, setMovie] = useState(null);
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
        const fetchMovieDetails = async () => {
            setLoading(true);
            const data = await getMovieDetails(movieId);
            setMovie(data);
            setLoading(false);
        };
        fetchMovieDetails();
    }, [movieId]);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!movie) {
        return <div className="error">Movie not found</div>;
    }

    return (
        <>
            <Navbar />
            <div className="movie-page">
                <div className="movie-header-container">
                    <div className="movie-header">
                        <h1 className="movie-title">{movie.title}</h1>
                        <div className="movie-metadata">
                            <span>{movie.year}</span>
                            <span>&nbsp;·&nbsp;</span>
                            <span>{movie.contentRating}</span>
                            <span>&nbsp;·&nbsp;</span>
                            <span>{Math.floor(movie.duration/60)}h {movie.duration%60}m</span>
                        </div>
                    </div>
                    <div className="movie-sidebar">
                        <div className="rating-section">
                            <div className="imdb-rating">
                                <h4 style={{fontSize: '15px', fontWeight: 'bold'}} >IMDb RATING</h4>
                                <div className="star-rating">
                                    <span className="star">★</span>
                                    <span className="rating-value">{movie.rating}/10</span>
                                </div>
                                <span className="votes">{movie.imdb_votes}</span>
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
                                    <span style={{marginTop: '5px'}}>{movie.popularity}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="movie-content">
                    <div className="movie-main">
                        <div className="movie-trailer-container">
                            <div className="movie-poster">
                                <img 
                                    src={movie.image} 
                                    alt={movie.title} 
                                    className="search-result-image" 
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "/imdb-logo.svg"; // Fallback image
                                    }}
                                />
                            </div>
                            <div className="movie-trailer">
                                <div className="play-button">
                                    <span className="play-icon">▶</span>
                                    <span>Play trailer</span>
                                    <span className="trailer-duration"></span>
                                </div>
                            </div>
                        </div>

                        <div className="movie-genres">
                            {movie.tags.map((tag, index) => (
                                <span key={index} className="genre-tag">{tag}</span>
                            ))}
                        </div>

                        <div className="movie-description">
                            <p>{movie.description}</p>
                        </div>

                        <div className="movie-crew">
                            <div className="crew-section">
                                <h3>Director</h3>
                                <p>{movie.director}</p>
                            </div>
                            
                            <div className="crew-section">
                                <h3>Writers</h3>
                                <p>{movie.writers.join(" · ")}</p>
                            </div>
                            
                            <div className="crew-section">
                                <h3>Stars</h3>
                                <p>{movie.actors.slice(0, 5).join(" · ")}</p>
                            </div>
                        </div>
                    </div>

                    
                </div>

                <div>
                    <h2 className="review-container-title">User Reviews</h2>
                    <div className="review-container">
                        {movie.reviews.slice(0,3).map(review => (
                            <div className="review">
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

export default Movie;