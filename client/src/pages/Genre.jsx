import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import Navbar from "../components/Navbar";
import "../css/Genre.css";
import { getLoggedIn, getFilteredItems } from "../api";
import ListItemThumbnail from "../components/ListItemThumbnail";
const Genre = () => {
    const navigate = useNavigate();
    const { genreId } = useParams();
    const [loading, setLoading] = useState(true);
    const [loggedInData, setLoggedInData] = useState({loggedIn: false, userName: ""});
    const [genreName, setGenreName] = useState(null);
    const [genreMovies, setGenreMovies] = useState([]);
    const [genreShows, setGenreShows] = useState([]);
    const location = useLocation();

    useEffect(() => {
        getLoggedIn().then(response => {
            if (response.status === 200) {
                response.json().then(data => {
                    setLoggedInData(data);
                });
            }
        });
    }, []);

    useEffect(() => {
        const fetchGenre = async () => {
            const movies = await getFilteredItems({genreId: genreId, forMovie: true, forShow: false});
            setGenreMovies(movies);
            const shows = await getFilteredItems({genreId: genreId, forMovie: false, forShow: true});
            setGenreShows(shows);
            setLoading(false);
            setGenreName(location.state.name);
        };
        fetchGenre();
    }, [genreId]);

    if (loading) {
        return <div>Loading...</div>;
    }
    
    return (
        <>
            <Navbar isLoggedIn={loggedInData.loggedIn} userName={loggedInData.username} />
            <div className="genre-container">
                <h1 className="genre-title">{genreName}</h1>
                { genreMovies && genreMovies.length > 0 && <ListItemThumbnail title={`Popular ${genreName} Movies`} titleFontSize="44px" itemThumbnails={genreMovies} loggedIn={loggedInData.loggedIn}/> }
                { genreShows && genreShows.length > 0 && <ListItemThumbnail title={`Popular ${genreName} Shows`} titleFontSize="44px" itemThumbnails={genreShows} loggedIn={loggedInData.loggedIn}/> }
            </div>
        </>
    );
}

export default Genre;