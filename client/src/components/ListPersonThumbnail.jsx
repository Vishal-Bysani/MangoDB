import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import "../css/ListPersonThumbnail.css";
import PersonThumbnail from "./PersonThumbnail";
const ListPersonThumbnail = ({ title, titleFontSize = "30px", personThumbnails }) => {
    const [startingIndex, setStartingIndex] = useState(0);
    const [rowLimit, setRowLimit] = useState(4);
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
                <div className="listPersonThumbnail-grid">
                    {personThumbnails.slice(startingIndex, startingIndex + rowLimit).map((personThumbnail, index) => (
                        <PersonThumbnail
                            key={personThumbnail.id}
                            ref={index === 0 ? thumbnailRef : null}
                            personId={personThumbnail.id}
                            name={personThumbnail.name}
                            image={personThumbnail.imageLink}
                            character={personThumbnail.character}
                        />
                    ))}
                </div>
                <button className="listPersonThumbnail-button" onClick={handleNext} disabled={startingIndex + rowLimit >= personThumbnails.length}>
                    <p className="forward-arrow"></p>
                </button>
            </div>
        </>
    )
}

export default ListPersonThumbnail;