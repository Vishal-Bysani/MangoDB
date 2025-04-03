import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { getLoggedIn } from "../api";
import Navbar from "../components/NavBar";

const ItemReviews = () => {
    const { itemId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const checkStatus = async () => {
            getLoggedIn().then(loggedIn => { 
                if (!loggedIn) navigate("/login"); 
            });
        };
        checkStatus();
    }, [navigate]);

    return (
        <>
            <Navbar />
            <div className="item-reviews-page" style={{marginTop: '200px'}}>
                <h1>Reviews for Item {itemId}</h1>
                <div className="reviews-container">
                    {/* Reviews will be displayed here */}
                </div>
            </div>
        </>
    );
}

export default ItemReviews;
