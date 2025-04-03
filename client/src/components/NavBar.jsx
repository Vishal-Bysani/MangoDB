import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { apiUrl } from "../config/config";
import "../css/NavBar.css";
import { getMatchingItems } from "../api"

const Navbar = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [searchText, setSearchText] = useState(""); // State for search text
  const [matchingList, setMatchingList] = useState([]); // State for matching results
  const searchContainerRef = useRef(null);

  const handleSearchChange = (e) => {
    const text = e.target.value;
    setSearchText(text);
    
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
    const checkStatus = async () => {
      try {
        // TODO: Activate the below code

        // const response = await fetch(`${apiUrl}/isLoggedIn`, {
        //   method: "GET",
        //   credentials: "include",
        // });
        // const data = await response.json();

        const data = {loggedIn: false};

        if (data.loggedIn) {
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
      } catch(err) {
        console.error("Error checking authentication status in NavBar:", err);
      }
    };
    checkStatus();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setMatchingList([]);
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
          <img src="/imdb-logo.svg" alt="Logo" className="nav-logo" onClick={() => navigate("/")}></img>
        </div>
        <div className="search-container" ref={searchContainerRef}>
          <input 
            type="text" 
            placeholder="Search IMDb" 
            className="search-input"
            value={searchText}
            onChange={handleSearchChange}
          />
          
          {/* Search results dropdown */}
          {matchingList.length > 0 && (
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
                        e.target.src = "/imdb-logo.svg"; // Fallback image
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
              <button className="nav-button" onClick={() => navigate("/profile")}>Profile</button>
            </div>
            <div className="nav-button-div">
              {/* TODO: Define an onClick action for logout */}
              <button className="nav-button">Logout</button>
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