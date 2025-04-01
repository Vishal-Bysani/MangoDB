import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { apiUrl } from "../config/config";
import "../css/NavBar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState(false);

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
    <nav >
        <div class="nav-container">
          <div>
              <img src="/imdb-logo.svg" alt="Logo" class="nav-logo" onClick={()=>navigate("/")}></img>
          </div>
          <div>
              <input type="text" placeholder="Search IMDb" class="search-input" />
          </div>
          {loggedIn ? (
            <>
              <div class="nav-button-div">
                  <button class="nav-button" onClick={()=>navigate("/profile")}>Profile</button>
              </div>
              <div class="nav-button-div">
                  {/* TODO: Define an onClick action for logout */}
                  <button class="nav-button">Logout</button>
              </div>
            </>
          ) : (
            <>
              <div class="nav-button-div">
                  <button class="nav-button" onClick={()=>navigate("/login")}>Login</button>
              </div>
              <div class="nav-button-div">
                  <button class="nav-button" onClick={()=>navigate("/signup")}>Sign Up</button>
              </div>
            </>
          )}
        </div>
    </nav>

  );
};

export default Navbar;