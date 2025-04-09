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
    setSearchText(e.target.value);
    setHideSearch(false);
    const trimmedText = e.target.value.trim().toLowerCase();

    if (trimmedText === "") {
      setMatchingList([]);
      return;
    }

    const filtered = matchingList.filter(item =>
      item.title.toLowerCase().startsWith(trimmedText)
    );
    if (searchText !== "" && trimmedText.startsWith(searchText.toLowerCase()) && filtered.length >= 5) {
      setMatchingList(filtered);
    } else {
      getMatchingItems(trimmedText).then(matchingItems => {
        setMatchingList(matchingItems);
      });
    }
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
                  onClick={item.popularity ? () => navigate(`/person/${item.id}`) : () => { navigate(`/item/${item.id}`); setSearchText(""); setHideSearch(true); }}
                >
                  <div className="search-result-content">
                    <img 
                      src={item.image ? item.image : "/item-backdrop.svg"} 
                      alt={item.title} 
                      className="search-result-image" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/item-backdrop.svg"; // Fallback image
                      }}
                    />
                    <div className="search-result-info">
                      <div className="search-result-text">
                        <div className="search-result-title">{item.title}</div>
                        { item.startYear && !item.endYear && <div className="search-result-year">{item.startYear}</div> }
                        { item.startYear && item.endYear && <div className="search-result-year">{item.startYear} - {item.endYear}</div> }
                        { item.role && <div className="search-result-year">{item.role}</div> }
                        { item.actors && <div className="search-result-actors">{item.actors.slice(0, 2).join(", ")}</div> }
                      </div>
                    </div>
                    { item.rating && <div className="search-result-rating">{parseFloat(item.rating).toFixed(1)} ⭐</div> }
                    { item.popularity && <div className="search-result-rating">{parseFloat(item.popularity).toFixed(1)} 🔥</div> }
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
              <button className="nav-button" onClick={() => { logoutUser(); setLoggedIn(false); navigate("/"); }}>Logout</button>
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