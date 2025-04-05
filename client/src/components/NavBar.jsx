import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { apiUrl } from "../config/config";
import "../css/NavBar.css";
import { getMatchingItems, logoutUser } from "../api"

const Navbar = ({isLoggedIn = false, userName = ""}) => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(isLoggedIn);
  const [searchText, setSearchText] = useState("");
  const [matchingList, setMatchingList] = useState([]);
  const [hideSearch, setHideSearch] = useState(false);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    setLoggedIn(isLoggedIn);
  }, [isLoggedIn]);

  const handleSearchChange = (e) => {
    const text = e.target.value;
    setSearchText(text);
    setHideSearch(false);

    if (text.trim() === "") {
      setMatchingList([]);
    } else if(searchText !== "" && text.toLowerCase().startsWith(searchText.toLowerCase())) {
      setMatchingList(matchingList.filter(item => 
        item.title.toLowerCase().startsWith(text.toLowerCase())
      ));
    } else {
      setMatchingList(getMatchingItems(text));
    }
    setSearchText(text);
  };

  const handleResultClick = (itemId) => {
    setSearchText("");
    setMatchingList([]);
    navigate(`/item/${itemId}`);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setHideSearch(true);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav>
      <div className="nav-container">
        <div>
          <img src="/mangodb-logo.png" alt="Logo" className="nav-logo" onClick={() => navigate("/")}></img>
        </div>
        <div className="search-container" ref={searchContainerRef}>
          <input 
            type="text" 
            placeholder="Search MangoDb" 
            className="search-input"
            value={searchText}
            onChange={handleSearchChange}
          />
          
          {/* Search results dropdown */}
          {!hideSearch && matchingList.length > 0 && (
            <div className="search-results">
              {matchingList.slice(0, 5).map(item => (
                <div 
                  key={item.id} 
                  className="search-result-item"
                  onClick={() => handleResultClick(item.id)}
                >
                  <div className="search-result-content">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="search-result-image" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/mangodb-logo.png"; // Fallback image
                      }}
                    />
                    <div className="search-result-info">
                      <div className="search-result-text">
                        <div className="search-result-title">{item.title}</div>
                        <div className="search-result-year">{item.startYear}</div>
                        <div className="search-result-actors">{item.actors.slice(0, 2).join(", ")}</div>
                      </div>
                    </div>
                    <div className="search-result-rating">{item.rating} ⭐</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {loggedIn ? (
          <>
            <div className="nav-button-div">
              <button className="nav-button" onClick={() => navigate("/profile")}> {userName} </button>
            </div>
            <div className="nav-button-div">
              {/* TODO: Define an onClick action for logout */}
              <button className="nav-button" onClick={() => { logoutUser(); setLoggedIn(false); }}>Logout</button>
            </div>
          </>
        ) : (
          <>
            <div className="nav-button-div">
              <button className="nav-button" onClick={() => navigate("/login")}>Login</button>
            </div>
            <div className="nav-button-div">
              <button className="nav-button" onClick={() => navigate("/signup")}>Sign Up</button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;