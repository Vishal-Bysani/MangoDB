import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router";
import { apiUrl } from "../config/config";
import "../css/Navbar.css";
import { getMatchingItems, logoutUser } from "../api"
import { loggedInDataContext, currentLinkContext } from "../Context";

const Navbar = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [matchingList, setMatchingList] = useState([]);
  const [hideSearch, setHideSearch] = useState(false);
  const searchContainerRef = useRef(null);
  const {loggedInData, setLoggedInData} = useContext(loggedInDataContext);
  const {currentLink, setCurrentLink} = useContext(currentLinkContext);

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
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchText.length > 0) {
                navigate(`/search?q=${searchText}`);
              }
            }}
          />
          
          {/* Search results dropdown */}
          {!hideSearch && matchingList.length > 0 && (
            <div className="search-results">
              {matchingList.slice(0, 5).map(item => (
                <div 
                  key={item.id} 
                  className="search-result-item"
                  onClick={item.popularity ? () => navigate(`/person/${item.id}`) : () => { if (item.category === "book") navigate(`/book/${item.id}`); else navigate(`/item/${item.id}`); setSearchText(""); setHideSearch(true); }}
                >
                  <div className="search-result-content">
                    <img 
                      src={item.image ? item.image : (item.published_date ? "/item-backdrop.svg" : (item.popularity ? "/person-backdrop.svg" : "/item-backdrop.svg"))} 
                      alt={item.title}
                      className="search-result-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/item-backdrop.svg";
                      }}
                    />
                    <div className="search-result-info">
                      <div className="search-result-text">
                        <div className="search-result-title">{item.title}</div>
                          <div className="search-result-year">
                            { item.published_date && <span>{item.published_date}</span>}
                            { item.startYear && !item.endYear && <span>{item.startYear}</span>}
                            { item.startYear && item.endYear && <span>{item.startYear} - {item.endYear}</span>}
                            { item.category == 'book' && <span>&nbsp;·&nbsp;Book</span>}
                            { item.type == 'tv' && <span>&nbsp;·&nbsp;TV Show</span>}
                            { item.type == 'movie' && <span>&nbsp;·&nbsp;Movie</span>}
                          </div>
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
        {loggedInData.loggedIn ? (
          <>
            <div className="nav-button-div">
              <button className="nav-button" onClick={() => navigate(`/profile/${loggedInData.username}`)}> {loggedInData.username} </button>
            </div>
            <div className="nav-button-div">
              <button className="nav-button" onClick={() => { logoutUser(); setLoggedInData({loggedIn: false, username: ""}); if(currentLink) window.location.reload(); else navigate("/"); }}>Logout</button>
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