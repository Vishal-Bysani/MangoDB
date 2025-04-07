import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import ItemThumbnail from "./ItemThumbnail";
import "../css/ListItemThumbnail.css";

const ListItemThumbnail = ({ title, titleFontSize, itemThumbnails }) => {
    const [startingIndex, setStartingIndex] = useState(0);
    const [rowLimit, setRowLimit] = useState(5);
    const containerRef = useRef(null);
    const thumbnailRef = useRef(null);

    useEffect(() => {
        const calculateRowLimit = () => {
            if (!containerRef.current || !thumbnailRef.current) return;
            const containerWidth = containerRef.current.clientWidth;
            const thumbnailElement = thumbnailRef.current;
            const thumbnailStyles = window.getComputedStyle(thumbnailElement);
            const thumbnailWidth = thumbnailElement.offsetWidth + 
                parseFloat(thumbnailStyles.marginLeft) + 
                parseFloat(thumbnailStyles.marginRight);
            const buttonWidth = 50;
            const availableWidth = containerWidth - (buttonWidth * 2);
            const calculatedLimit = Math.floor(availableWidth / thumbnailWidth);
            const newRowLimit = Math.max(1, Math.min(calculatedLimit, itemThumbnails.length));
            if (newRowLimit !== rowLimit) {
                setRowLimit(newRowLimit);
                if (startingIndex + newRowLimit > itemThumbnails.length) {
                    setStartingIndex(Math.max(0, itemThumbnails.length - newRowLimit));
                }
            }
        };
        calculateRowLimit();
        const handleResize = () => {
            calculateRowLimit();
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [itemThumbnails.length, rowLimit, startingIndex]);

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
            <div className="listItemThumbnail-container" ref={containerRef}>
                <button className="listItemThumbnail-button" onClick={handlePrevious} disabled={startingIndex === 0}>
                    <p className="backward-arrow"></p>
                </button>
                <div className="listItemThumbnail-item-thumbnail-grid">
                    {itemThumbnails.slice(startingIndex, startingIndex + rowLimit).map((itemThumbnail, index) => (
                        <ItemThumbnail 
                            key={itemThumbnail.itemId}
                            ref={index === 0 ? thumbnailRef : null}
                            itemId={itemThumbnail.id}
                            title={itemThumbnail.title}
                            image={itemThumbnail.image}
                            year={itemThumbnail.year}
                            rating={itemThumbnail.rating}
                            userRating={itemThumbnail.userRating}
                            startYear={itemThumbnail.startYear}
                            endYear={itemThumbnail.endYear}
                            cast={itemThumbnail.cast}
                            crew={itemThumbnail.crew}
                        />
                    ))}
                </div>
                <button className="listItemThumbnail-button" onClick={handleNext} disabled={startingIndex + rowLimit >= itemThumbnails.length}>
                    <p className="forward-arrow"></p>
                </button>
            </div>
        </>
    );
};

export default ListItemThumbnail;