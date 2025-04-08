import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "../components/NavBar";
import "../css/Home.css";
import { getTrendingMovies, getTrendingShows, getLoggedIn } from "../api";
import ListItemThumbnail from "../components/ListItemThumbnail";
import SearchBar from "../components/SearchBar";

const Home = () => {
    const navigate = useNavigate();
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [trendingShows, setTrendingShows] = useState([]);
    const [loggedInData, setLoggedInData] = useState({loggedIn: false, username: ""});

    useEffect(() => {
        const fetchTrendingMovies = async () => {
            const trendingMovies = await getTrendingMovies();
            setTrendingMovies(trendingMovies);
        };
        fetchTrendingMovies();
    }, []);

    useEffect(() => {
        const fetchTrendingShows = async () => {
            const trendingShows = await getTrendingShows();
            setTrendingShows(trendingShows);
        };
        fetchTrendingShows();
    }, []);

    useEffect(() => {
        getLoggedIn().then(response => {
            if (response.status === 200) {
                response.json().then(data => {
                    setLoggedInData(data);
                });
            }
        });
    }, []);

    return (
        <>
            <Navbar isLoggedIn={loggedInData.loggedIn} userName={loggedInData.username} />
                <div className="home-explore-container" style={{backgroundImage: "url(./home-explore-background.jpeg)"}}>
                    <div className="home-explore-container-text">
                        <span className="home-explore-container-text-title">Welcome</span>
                        <span className="home-explore-container-text-subtitle">Millions of movies, TV shows and people to discover. Explore now.</span>
                    </div>
                    <SearchBar handleSearch={(searchText) => {
                        navigate(`/search/${searchText}`);
                    }} />
                </div>
            <div className="home-container">
                { trendingMovies && trendingMovies.length > 0 && <ListItemThumbnail title="Trending Movies" titleFontSize="44px" itemThumbnails={trendingMovies} /> }
                { trendingShows && trendingShows.length > 0 && <ListItemThumbnail title="Trending Shows" titleFontSize="44px" itemThumbnails={trendingShows} /> }
            </div>
        </>
    );
}

export default Home;
