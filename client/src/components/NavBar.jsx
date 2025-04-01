import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { apiUrl } from "../config/config";
import "../css/NavBar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [searchText, setSearchText] = useState(""); // State for search text
  const [matchingList, setMatchingList] = useState([]); // State for matching results

  const mockMovies = [
    { id: 1, title: "The Dark Knight", image: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_QL75_UX380_CR0,0,380,562_.jpg", year: 2008, rating: 9.0, actors: ["Christian Bale", "Heath Ledger"] },
    { id: 2, title: "The Godfather", image: "https://m.media-amazon.com/images/M/MV5BNGEwYjgwOGQtYjg5ZS00Njc1LTk2ZGEtM2QwZWQ2NjdhZTE5XkEyXkFqcGc@._V1_QL75_UY281_CR4,0,190,281_.jpg", year: 1972, rating: 9.2, actors: ["Marlon Brando", "Al Pacino"] },
    { id: 3, title: "The Italian Job", image: "https://m.media-amazon.com/images/M/MV5BMjJjNzc5YjAtZjU2Ni00ZjVkLTkzYmItM2E2NDM0NWE1YmJhXkEyXkFqcGc@._V1_QL75_UX190_CR0,2,190,281_.jpg", year: 2003, rating: 7.0, actors: ["Mark Wahlberg", "Charlize Theron"] },
    { id: 4, title: "Zodiac", image: "https://m.media-amazon.com/images/M/MV5BNDFkMTRkZmQtM2I0NC00NjJjLWJlMDctNTNiZWYxYzhjZDZiXkEyXkFqcGc@._V1_QL75_UY281_CR0,0,190,281_.jpg", year: 2007, rating: 7.7, actors: ["Jake Gyllenhaal", "Robert Downey Jr."] },
    { id: 5, title: "Bourne Identity", image: "https://m.media-amazon.com/images/M/MV5BYTk1ZTcyMWMtMWUxYS00MmEzLTlmODYtOTk1MGRjOTg1ZjlmXkEyXkFqcGc@._V1_QL75_UX190_CR0,2,190,281_.jpg", year: 2002, rating: 7.9, actors: ["Matt Damon", "Franka Potente"] },
    { id: 6, title: "Schindler's List", image: "https://m.media-amazon.com/images/M/MV5BMTg3MDc4ODgyOF5BMl5BanBnXkFtZTgwNzY1ODIyNjM@._V1_QL75_UX190_CR0,10,190,281_.jpg", year: 1993, rating: 8.9, actors: ["Liam Neeson", "Ralph Fiennes"] },
    { id: 7, title: "1917", image: "https://m.media-amazon.com/images/M/MV5BYzkxZjg2NDQtMGVjMy00NWZkLTk0ZDEtZWE3NDYwYjAyMTg1XkEyXkFqcGc@._V1_QL75_UX190_CR0,10,190,281_.jpg", year: 2017, rating: 8.3, actors: ["George MacKay", "Dean-Charles Chapman"] }
  ];

  // TODO: Properly integrate with API
  const getMatchingMovies = (text) => {
    const matches = mockMovies.filter(movie => 
      movie.title.toLowerCase().includes(text.toLowerCase())
    );
    return matches;
  }

  const handleSearchChange = (e) => {
    const text = e.target.value;
    setSearchText(text);
    
    if (text.trim() === "") {
      setMatchingList([]);
    } else if(searchText !== "" && text.toLowerCase().includes(searchText.toLowerCase())) {
      setMatchingList(matchingList.filter(movie => 
        movie.title.toLowerCase().includes(text.toLowerCase())
      ));
    } else {
      setMatchingList(getMatchingMovies(text));
    }
    setSearchText(text);
  };

  // Handle clicking on a search result
  const handleResultClick = (movieId) => {
    // Navigate to movie details page
    navigate(`/movie/${movieId}`);
    setSearchText(""); // Clear search
    setMatchingList([]); // Clear results
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

  return (
    <nav>
      <div className="nav-container">
        <div>
          <img src="/imdb-logo.svg" alt="Logo" className="nav-logo" onClick={() => navigate("/")}></img>
        </div>
        <div className="search-container">
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
              {matchingList.map(movie => (
                <div 
                  key={movie.id} 
                  className="search-result-item"
                  onClick={() => handleResultClick(movie.id)}
                >
                  <div className="search-result-content">
                    <img 
                      src={movie.image} 
                      alt={movie.title} 
                      className="search-result-image" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder-movie.jpg"; // Fallback image
                      }}
                    />
                    <div className="search-result-info">
                      <div className="search-result-text">
                        <div className="search-result-title">{movie.title}</div>
                        <div className="search-result-year">{movie.year}</div>
                        <div className="search-result-actors">{movie.actors.join(', ')}</div>
                      </div>
                    </div>
                    <div className="search-result-rating">{movie.rating} ⭐</div>
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