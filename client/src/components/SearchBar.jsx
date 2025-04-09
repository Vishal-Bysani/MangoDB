import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import "../css/SearchBar.css";

const SearchBar = ( { handleSearch, setParentSearchText = null, initialSearchText = "" } ) => {
    const [searchText, setSearchText] = useState(initialSearchText);

    return (
        <div className="search-bar-container">
            <input
                className="search-bar-input"
                type="text"
                placeholder="Search for a movie, tv show, person......"
                aria-label="Search"
                value={searchText}
                onChange={(e) => {
                    setSearchText(e.target.value);
                    if (setParentSearchText) setParentSearchText(e.target.value);
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && searchText.length > 0) {
                        handleSearch(searchText);
                    }
                }}
            />
            <button className="search-bar-button" onClick={() => handleSearch(searchText)}>Search</button>
        </div>
    )
}

export default SearchBar;