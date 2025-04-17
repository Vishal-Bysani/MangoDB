import React, { useState, useEffect, useRef } from "react";
import ItemThumbnail from "./ItemThumbnail";
import "../css/ListItemThumbnail.css";

const ListItemThumbnail = ({ title, titleFontSize, itemThumbnails, loggedIn }) => {
    const [startingIndex, setStartingIndex] = useState(0);
    const [rowLimit, setRowLimit] = useState(5);
    const containerRef = useRef(null);
    const thumbnailRef = useRef(null);
    const sliderRef = useRef(null);

    useEffect(() => {
        const calculateRowLimit = () => {
            if (!containerRef.current) return;
            const containerWidth = containerRef.current.clientWidth;
            const buttonWidth = 50;
            const gapWidth = 20;
            const availableWidth = containerWidth - (buttonWidth * 2) - (gapWidth * 2);
            const itemWidth = 200;
            const calculatedLimit = Math.floor(availableWidth / (itemWidth + gapWidth));
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
        
    useEffect(() => {
        if (sliderRef.current) {
            const itemWidth = 200;
            const gapWidth = 25;
            const offset = startingIndex * (itemWidth + gapWidth);
            sliderRef.current.style.transform = `translateX(-${offset}px)`;
        }
    }, [startingIndex]);

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
                <div className="listItemThumbnail-item-viewport">
                    <div 
                        className="listItemThumbnail-item-slider" 
                        ref={sliderRef}
                    >
                        {itemThumbnails.map((itemThumbnail, index) => (
                            <div 
                                key={itemThumbnail.itemId || index} 
                                className="listItemThumbnail-item-wrapper"
                                ref={index === 0 ? thumbnailRef : null}
                            >
                                <ItemThumbnail 
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
                                    isWatchListed={itemThumbnail.isWatchListed}
                                    loggedIn={loggedIn}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <button className="listItemThumbnail-button" onClick={handleNext} disabled={startingIndex + rowLimit >= itemThumbnails.length}>
                    <p className="forward-arrow"></p>
                </button>
            </div>
        </>
    );
};

export default ListItemThumbnail;