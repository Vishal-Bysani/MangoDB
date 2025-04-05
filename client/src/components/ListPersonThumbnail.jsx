import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import "../css/ListPersonThumbnail.css";
import PersonThumbnail from "./PersonThumbnail";
const ListPersonThumbnail = ({ title, titleFontSize = "30px", personThumbnails, rowLimit = 4 }) => {
    const [startingIndex, setStartingIndex] = useState(0);

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
            <div className="listPersonThumbnail-container">
                <button className="listPersonThumbnail-button" onClick={handlePrevious} disabled={startingIndex === 0}>
                    <p className="backward-arrow"></p>
                </button>
                <div className="listPersonThumbnail-grid">
                    {personThumbnails.slice(startingIndex, startingIndex + rowLimit).map((personThumbnail) => (
                        <PersonThumbnail
                            key={personThumbnail.id}
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