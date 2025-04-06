import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getLoggedIn, getItemReviews } from "../api";
import Navbar from "../components/NavBar";
import "../css/ItemReviews.css";

const ItemReviews = () => {
    const { itemId } = useParams();
    const [itemReviews, setItemReviews] = useState([]);
    const [title, setTitle] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loggedInData, setLoggedInData] = useState({loggedIn: false, userName: ""});
    const navigate = useNavigate();

    useEffect(() => {
        getLoggedIn().then(response => {
            if (response.status === 200) {
                response.json().then(data => {
                    setLoggedInData(data);
                });
            } else {
                navigate("/login");
            }
        });
    }, []);

    useEffect(() => {
        const fetchReviews = async () => {
            const reviews = await getItemReviews(itemId, currentPage);
            setItemReviews(reviews.reviews);
            setTotalPages(reviews.totalPages);
            setTitle(reviews.title);
        };
        fetchReviews();
    }, [itemId, currentPage]);


    return (
        <>
            <Navbar isLoggedIn={loggedInData.loggedIn} userName={loggedInData.userName} />
            <div className="item-reviews-page" style={{marginTop: '200px'}}>
                <h1 className="item-reviews-title" onClick={() => navigate(`/item/${itemId}`)} style={{cursor: 'pointer'}}>{title}</h1>
                <div className="reviews-container">
                    {itemReviews && itemReviews.map(review => (
                        <div key={review.reviewId} className="review-card">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <span className="star">★</span>
                                <span className="review-card-rating">{review.rating}/10</span>
                            </div>
                            <p className="review-card-text">{review.text}</p>
                            <div className="review-card-footer">
                                <h3 className="review-card-username" onClick={() => navigate(`/user/${review.userId}`)}>{review.username}, </h3>
                                <p className="review-card-date">{review.date}</p>
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
