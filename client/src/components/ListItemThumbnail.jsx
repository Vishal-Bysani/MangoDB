import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import ItemThumbnail from "./ItemThumbnail";
import "../css/ListItemThumbnail.css";

const ListItemThumbnail = ({ title, titleFontSize, itemThumbnails, rowLimit = 5 }) => {
    const [startingIndex, setStartingIndex] = useState(0);

    const handleNext = () => {
        if (startingIndex + 2 * rowLimit < itemThumbnails.length) {
            setStartingIndex(startingIndex + rowLimit);
        } else if (startingIndex + rowLimit < itemThumbnails.length) {
            setStartingIndex(itemThumbnails.length - rowLimit);
        }
    }

    const handlePrevious = () => {
        if (startingIndex - rowLimit >= 0) {
            setStartingIndex(startingIndex - rowLimit);
        } else if (startingIndex - rowLimit < 0) {
            setStartingIndex(0);
        }
    }
    return (
        <>
            <h2 className="listItemThumbnail-item-thumbnail-title" style={{ fontSize: titleFontSize }}>{title}</h2>
            <div className="listItemThumbnail-container">
                <button className="listItemThumbnail-button" onClick={handlePrevious} disabled={startingIndex === 0}>
                    <p className="backward-arrow"></p>
                </button>
                <div className="listItemThumbnail-item-thumbnail-grid">
                    {itemThumbnails.map((itemThumbnail) => (
                        <ItemThumbnail 
                            key={itemThumbnail.itemId}
                            itemId={itemThumbnail.itemId}
                            title={itemThumbnail.title}
                            image={itemThumbnail.imageLink}
                            year={itemThumbnail.year}
                            rating={itemThumbnail.rating}
                        />
                    ))}
                </div>
                <button className="listItemThumbnail-button" onClick={handleNext} disabled={startingIndex + rowLimit >= itemThumbnails.length}>
                    <p className="forward-arrow"></p>
                </button>
            </div>
        </>
    )
}

export default ListItemThumbnail;