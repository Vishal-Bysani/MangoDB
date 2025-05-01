import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import Navbar from "../components/Navbar";
import "../css/Genre.css";
import { getLoggedIn, getFilteredItems } from "../api";
import ListItemThumbnail from "../components/ListItemThumbnail";
import Loading from "../components/Loading";
import { loggedInDataContext, currentLinkContext } from "../Context";

const Genre = () => {
    const { genreId } = useParams();
    const [loading, setLoading] = useState(true);
    const {loggedInData, setLoggedInData} = useContext(loggedInDataContext);
    const {currentLink, setCurrentLink} = useContext(currentLinkContext);
    const [genreName, setGenreName] = useState(null);
    const [genreMovies, setGenreMovies] = useState([]);
    const [genreShows, setGenreShows] = useState([]);
    const location = useLocation();

    useEffect(() => {
        setLoggedInData(getLoggedIn());
        setCurrentLink(`/genre/${genreId}`);
    }, []);

    useEffect(() => {
        const fetchGenre = async () => {
            const movies = await getFilteredItems({genreId: genreId, forMovie: true, forShow: false});
            setGenreMovies(movies);
            const shows = await getFilteredItems({genreId: genreId, forMovie: false, forShow: true});
            setGenreShows(shows);
            setLoading(false);
            setGenreName(location.state.name);
            document.title = `${location.state.name} | Genre`;
        };
        fetchGenre();
    }, [genreId]);

    if (loading) {
        return (
            <>
                <Navbar />
                <Loading/>
            </>
        )
    }
    
    return (
        <>
            <Navbar />
            <div className="genre-container">
                <h1 className="genre-title">{genreName}</h1>
                { genreMovies && genreMovies.length > 0 && <ListItemThumbnail title={`Popular ${genreName} Movies`} titleFontSize="44px" itemThumbnails={genreMovies}/> }
                { genreShows && genreShows.length > 0 && <ListItemThumbnail title={`Popular ${genreName} Shows`} titleFontSize="44px" itemThumbnails={genreShows}/> }
            </div>
        </>
    );
}

export default Genre;