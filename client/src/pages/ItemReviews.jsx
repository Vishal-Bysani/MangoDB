import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import { getLoggedIn } from "../api";
import Navbar from "../components/Navbar";
import "../css/ItemReviews.css";
import { loggedInDataContext, currentLinkContext } from "../Context";

const ItemReviews = () => {
    const { itemId } = useParams();
    const [itemReviews, setItemReviews] = useState([]);
    const [title, setTitle] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const {loggedInData, setLoggedInData} = useContext(loggedInDataContext);
    const {currentLink, setCurrentLink} = useContext(currentLinkContext);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        setLoggedInData(getLoggedIn());
        if (location.state) {
            setItemReviews(location.state.reviews);
            setTitle(location.state.title);
            if (location.state.reviews) setTotalPages(Math.ceil(location.state.reviews.length / 5));
        }
    }, []);


    return (
        <>
            <Navbar />
            <div className="item-reviews-page" style={{marginTop: '200px'}}>
                <h1 className="item-reviews-title" onClick={() => navigate(`/item/${itemId}`)} style={{cursor: 'pointer'}}>{title}</h1>
                <div className="reviews-container">
                    {itemReviews && itemReviews.slice((currentPage - 1) * 5, currentPage * 5).map(review => (
                        <div key={review.reviewId} className="review-card">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <span className="star">★</span>
                                <span className="review-card-rating">{review.rating}/10</span>
                            </div>
                            <p className="review-card-text">{review.text}</p>
                            <div className="review-card-footer">
                                <h3 className="review-card-username" onClick={() => navigate(`/profile/${review.username}`)}>{review.username}, </h3>
                                <p className="review-card-date">{review.time_ago}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="pagination-container">
                    <button className="pagination-button" onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))} disabled={currentPage === 1}>Previous</button>
                    <span className="pagination-info">{currentPage} of {totalPages}</span>
                    <button className="pagination-button" onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))} disabled={currentPage === totalPages}>Next</button>
                </div>
            </div>
        </>
    );
}

export default ItemReviews;
