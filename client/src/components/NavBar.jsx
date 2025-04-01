import React from "react";
import { useNavigate } from "react-router";
import { apiUrl } from "../config/config";
import "../css/NavBar.css";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav >
        <div class="nav-container">
          <div>
              <img src="/imdb-logo.svg" alt="Logo" class="nav-logo" onClick={()=>navigate("/")}></img>
          </div>
          <div>
              <input type="text" placeholder="Search IMDb" class="search-input" />
          </div>
          <div class="nav-button-div">
              <button class="nav-button" onClick={()=>navigate("/login")}>Login</button>
          </div>
          <div class="nav-button-div">
              <button class="nav-button" onClick={()=>navigate("/signup")}>Sign Up</button>
          </div>
          <div class="nav-button-div">
              <button class="nav-button">Logout</button>
          </div>
        </div>
    </nav>

  );
};

export default Navbar;