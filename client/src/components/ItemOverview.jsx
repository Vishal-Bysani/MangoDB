import React, { forwardRef } from "react";
import { useNavigate } from "react-router";
import "../css/ItemOverview.css";

const ItemOverview = forwardRef(({ itemId, title, image, year, rating, userRating, startYear, endYear, cast, crew , description }, ref) => {
    const navigate = useNavigate();
    return (
        <div className="item-overview-container" ref={ref}>
            <div className="item-overview-content">
                <div className="item-overview-image-container">
                    <img
                        src={image}
                        alt={title}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/mangodb-logo.png";
                        }}
                        className="item-overview-image"
                        onClick={() => navigate(`/item/${itemId}`)}
                    />
                </div>
                <div className="item-overview-info-container">
                    <p onClick={() => navigate(`/item/${itemId}`)} style={{ cursor: "pointer", fontSize: "36px", fontWeight: "bolder", color: "#10e3a5", marginBottom: "10px" }}>{title}</p>
                    <div className="item-overview-rating-container">
                        <p style={{fontWeight: 'bold'}}><span className="item-overview-yellow-star">★</span> {parseFloat(rating).toFixed(1)}/10</p>
                        { userRating > 0 && <p style={{fontWeight: 'bold'}}><span className="item-overview-blue-star">★</span> {parseFloat(userRating).toFixed(1)}/10</p> }
                    </div>
                    { year && <p>{year}</p> }
                    { startYear && endYear && <p>{startYear} - {endYear}</p> }
                    { cast && cast.length > 0 && <p>{cast.slice(0, 4).map(c => c.name).join(', ')}</p> }
                    <p style={{marginTop: "10px", fontSize: "18px", fontWeight: "normal"}}>{description}</p>
                </div>
            </div>
        </div>
    )
})

export default ItemOverview;