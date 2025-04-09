import React, { forwardRef } from "react";
import { useNavigate } from "react-router";
import "../css/ItemThumbnail.css";

const ItemThumbnail = forwardRef(({ itemId, title, image, year, rating, userRating, startYear, endYear, cast, crew }, ref) => {
    const navigate = useNavigate();
    return (
        <>
            <div 
                key={itemId} 
                className="ItemThumbnail-item-thumbnail"
                onClick={() => navigate(`/item/${itemId}`)}
                ref={ref}
            >
                <div className="ItemThumbnail-image-container">
                    <img 
                        src={image ? image : "/item-backdrop.svg"}
                        alt={title}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/item-backdrop.svg";
                        }}
                    />
                </div>
                <div className="ItemThumbnail-rating-container">
                    <p style={{fontWeight: 'bold'}}><span className="ItemThumbnail-yellow-star">★</span> {parseFloat(rating).toFixed(1)}/10</p>
                    { userRating > 0 && <p style={{fontWeight: 'bold'}}><span className="ItemThumbnail-blue-star">★</span> {parseFloat(userRating).toFixed(1)}/10</p> }
                </div>
                <h4>{title}</h4>
                { year && <p style={{fontWeight: 'bold'}}>{year}</p> }
                { startYear && !endYear && <p style={{fontWeight: 'bold'}}>{startYear}</p> }
                { startYear && endYear && <p style={{fontWeight: 'bold'}}>{startYear} - {endYear}</p> }
                { cast && <p style={{fontWeight: 'bold'}}>{cast.slice(0, 2).map(c => c.name).join(', ')}</p> }
            </div>
        </>
    )
})

export default ItemThumbnail;