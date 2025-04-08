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
                    <h1 onClick={() => navigate(`/item/${itemId}`)} style={{ cursor: "pointer", fontSize: "36px", fontWeight: "bolder", color: "#10e3a5" }}>{title}</h1>
                    { year && <p>{year}</p> }
                    { startYear && endYear && <p>{startYear} - {endYear}</p> }
                    <p>{description}</p>
                </div>
            </div>
        </div>
    )
})

export default ItemOverview;