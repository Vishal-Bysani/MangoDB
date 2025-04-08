import React, { useState, useEffect, useRef } from "react";
import "../css/ListPersonThumbnail.css";
import PersonThumbnail from "./PersonThumbnail";
const ListPersonThumbnail = ({ title, titleFontSize = "30px", personThumbnails }) => {
    const [startingIndex, setStartingIndex] = useState(0);
    const [rowLimit, setRowLimit] = useState(4);
    const containerRef = useRef(null);
    const thumbnailRef = useRef(null);
    const sliderRef = useRef(null);

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
            const newRowLimit = Math.max(1, Math.min(calculatedLimit, personThumbnails.length));
            if (newRowLimit !== rowLimit) {
                setRowLimit(newRowLimit);
                if (startingIndex + newRowLimit > personThumbnails.length) {
                    setStartingIndex(Math.max(0, personThumbnails.length - newRowLimit));
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
    }, [personThumbnails.length, rowLimit, startingIndex]);

    useEffect(() => {
        if (sliderRef.current) {
            const itemWidth = 200;
            const gapWidth = 25;
            const offset = startingIndex * (itemWidth + gapWidth);
            sliderRef.current.style.transform = `translateX(-${offset}px)`;
        }
    }, [startingIndex]);

    const handleNext = () => {
        if (startingIndex + 2 * rowLimit < personThumbnails.length) {
            setStartingIndex(startingIndex + rowLimit);
        } else if (startingIndex + rowLimit < personThumbnails.length) {
            setStartingIndex(personThumbnails.length - rowLimit);
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
            <h2 className="listPersonThumbnail-title" style={{ fontSize: titleFontSize }}>{title}</h2>
            <div className="listPersonThumbnail-container" ref={containerRef}>
                <button className="listPersonThumbnail-button" onClick={handlePrevious} disabled={startingIndex === 0}>
                    <p className="backward-arrow"></p>
                </button>
                <div className="listPersonThumbnail-item-viewport">
                    <div 
                        className="listPersonThumbnail-item-slider" 
                        ref={sliderRef}
                    >
                        {personThumbnails.map((personThumbnail, index) => (
                            <div 
                                key={personThumbnail.id || index} 
                                className="listPersonThumbnail-item-wrapper"
                                ref={index === 0 ? thumbnailRef : null}
                            >
                                <PersonThumbnail 
                                    personId={personThumbnail.id}
                                    name={personThumbnail.name}
                                    image={personThumbnail.image}
                                    character={personThumbnail.character}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <button className="listPersonThumbnail-button" onClick={handleNext} disabled={startingIndex + rowLimit >= personThumbnails.length}>
                    <p className="forward-arrow"></p>
                </button>
            </div>
        </>
    )
}

export default ListPersonThumbnail;