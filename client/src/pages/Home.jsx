import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import "../css/Home.css";
import { getTrendingMovies, getTrendingShows, getLoggedIn, getTrendingBooks } from "../api";
import ListItemThumbnail from "../components/ListItemThumbnail";
import SearchBar from "../components/SearchBar";
import { loggedInDataContext, currentLinkContext } from "../Context";

const Home = () => {
    const navigate = useNavigate();
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [trendingShows, setTrendingShows] = useState([]);
    const [trendingBooks, setTrendingBooks] = useState([]);
    const {loggedInData, setLoggedInData} = useContext(loggedInDataContext);
    const {currentLink, setCurrentLink} = useContext(currentLinkContext);

    useEffect(() => {
        // const fetchTrendingMovies = async () => {
        //     const trendingMovies = await getTrendingMovies();
        //     setTrendingMovies(trendingMovies);
        // };
        // const fetchTrendingShows = async () => {
        //     const trendingShows = await getTrendingShows();
        //     setTrendingShows(trendingShows);
        // };
        // fetchTrendingMovies();
        // fetchTrendingShows();
        getTrendingMovies().then(setTrendingMovies);
        getTrendingShows().then(setTrendingShows);
        getTrendingBooks().then(setTrendingBooks);
    }, []);

    useEffect(() => {
        console.log(trendingMovies);
    }, [trendingMovies])

    useEffect(() => {
        getLoggedIn().then(response => {
            if (response.status === 200) {
                response.json().then(data => {
                    setLoggedInData(data);
                });
            }
        });
        setCurrentLink(`/`);
        document.title = "Mangodb";
    }, []);

    return (
        <>
            <Navbar />
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
                { trendingMovies && trendingMovies.length > 0 && <ListItemThumbnail title="Trending Movies" titleFontSize="44px" itemThumbnails={trendingMovies}/> }
                { trendingShows && trendingShows.length > 0 && <ListItemThumbnail title="Trending Shows" titleFontSize="44px" itemThumbnails={trendingShows}/> }
                { trendingBooks && trendingBooks.length > 0 && <ListItemThumbnail title="Trending Books" titleFontSize="44px" itemThumbnails={trendingBooks} forBook={true}/> }
            </div>
        </>
    );
}

export default Home;
