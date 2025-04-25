import { cache } from "react";
import { apiUrl } from "./config/config.js";
import { Navigate } from "react-router";
import Collection from "./pages/Collection.jsx";

const getLoggedIn = async () => {
    return fetch(`${apiUrl}/isLoggedIn`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });
}

const logoutUser = async () => {
    fetch(`${apiUrl}/logout`, {
        method: "POST",
        credentials: "include",
    }).then(response => {
        if (response.status !== 200) {
            throw new Error("Failed to log out");
        }
    }).catch(err => {
        console.error("Error logging out:", err);
    });
}

const loginUser = async (user, password) => {
    return fetch(`${apiUrl}/login`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user, password }),
    });
}

const signupUser = async (username, password, email) => {
    return fetch(`${apiUrl}/signup`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, email }),
    });
}

const getItemDetails = async (itemId) => {
    // await new Promise(resolve => setTimeout(resolve, 2000));
    const response = await fetch(`${apiUrl}/getMovieShowDetails?id=${itemId}`, { credentials: "include" });
    const data = await response.json();
    return data;
}

const getMatchingItems = async (text) => {
    const response = await fetch(`${apiUrl}/getMatchingItem?text=${text}`);
    const data = await response.json();
    return data;
}

const submitRating = async (itemId, rating) => {
    fetch(`${apiUrl}/submitRatingReview?id=${itemId}&rating=${rating}`, {
        method: "POST",
        credentials: "include",
    });
    fetch(`${apiUrl}/addToWatchedList?id=${itemId}`, {
        method: "POST",
        credentials: "include",
    });
}

const submitReview = async (itemId, rating, review) => {
    fetch(`${apiUrl}/submitRatingReview?id=${itemId}&rating=${rating}&review=${review}`, {
        method: "POST",
        credentials: "include",
    });
    fetch(`${apiUrl}/addToWatchedList?id=${itemId}`, {
        method: "POST",
        credentials: "include",
    });
}

const getPersonDetails = async (personId) => {
    const response = await fetch(`${apiUrl}/getPersonDetails?id=${personId}`);
    const data = await response.json();
    return data;
}

const setFavourite = async (itemId, favourite) => {
    if (favourite) {
        fetch(`${apiUrl}/addToFavourites?id=${itemId}`, {
            method: "POST",
            credentials: "include",
        });
    } else {
        fetch(`${apiUrl}/removeFromFavourites?id=${itemId}`, {
            method: "POST",
            credentials: "include",
        });
    }
}

const getTrendingMovies = async (pageNo = 1, pageLimit = 25) => {
    const response = await fetch(`${apiUrl}/getMoviesByPopularity?pageNo=${pageNo}&pageLimit=${pageLimit}`);
    const data = await response.json();
    return data.movies;
}

const getTrendingShows = async (pageNo = 1, pageLimit = 25) => {
    const response = await fetch(`${apiUrl}/getShowsByPopularity?pageNo=${pageNo}&pageLimit=${pageLimit}`);
    const data = await response.json();
    return data.shows;
}

const getFilteredItems = async ({searchText = null,
                                personId = null,
                                genreId = null,
                                year = null,
                                minRating = null,
                                orderByRating = false,
                                orderByPopularity = false,
                                forMovie = true,
                                forShow = true,
                                pageNo = 1,
                                pageLimit = 10 }) => {
    let baseUrl = `${apiUrl}/filterItems?`;
    if (searchText) baseUrl += `searchText=${searchText}&`;
    if (personId) baseUrl += `personId=${personId}&`;
    if (genreId) baseUrl += `genreId=${genreId}&`;
    if (year) baseUrl += `year=${year}&`;
    if (minRating) baseUrl += `minRating=${minRating}&`;
    if (orderByRating) baseUrl += `orderByRating=${orderByRating}&`;
    if (orderByPopularity) baseUrl += `orderByPopularity=${orderByPopularity}&`;
    if (forMovie) baseUrl += `forMovie=${forMovie}&`;
    if (forShow) baseUrl += `forShow=${forShow}&`;
    if (pageNo) baseUrl += `pageNo=${pageNo}&`;
    if (pageLimit) baseUrl += `pageLimit=${pageLimit}&`;
    const response = await fetch(baseUrl);
    const data = await response.json();
    return data.items;
}

const getUserDetails = async (username) => {
    const userDetails = await fetch(`${apiUrl}/getUserDetails?username=${username}`, {
        method: "GET",
        credentials: "include",
    });
    const userDetailsData = await userDetails.json();
    return userDetailsData;
}

const getGenreList = async () => {
    const response = await fetch(`${apiUrl}/listGenres`);
    const data = await response.json();
    return data;
}

const getMatchingPersons = async (searchText, searchLimit = 5) => {
    const response = await fetch(`${apiUrl}/matchingPersons?searchText=${searchText}&searchLimit=${searchLimit}`);
    const data = await response.json();
    return data;
}

const followUser = async (followedUsername) => {
    const response = await fetch(`${apiUrl}/followUser?followed_username=${followedUsername}`, {
        method: "POST",
        credentials: "include",
    });
    const data = await response.json();
    return data;
}

const toggleWatchListed = async (itemId, watchListed) => {
    if (watchListed) {
        fetch(`${apiUrl}/addToWatchlist?id=${itemId}`, {
            method: "POST",
            credentials: "include",
        });
    } else {
        fetch(`${apiUrl}/removeFromWatchlist?id=${itemId}`, {
            method: "POST",
            credentials: "include",
        });
    }
}

const getSeasonDetails = async (showId, seasonId) => {
    const response = await fetch(`${apiUrl}/getSeasonDetails?show_id=${showId}&season_id=${seasonId}`);
    const data = await response.json();
    return data;
}

const getCollectionDetails = async (collectionId, pageNo = 1, pageLimit = 1000) => {
    const response = await fetch(`${apiUrl}/getMovieShowByCollectionId?collection_id=${collectionId}&pageNo=${pageNo}&pageLimit=${pageLimit}`);
    const data = await response.json();
    return data;
}

export { toggleWatchListed, getCollectionDetails, getLoggedIn, getItemDetails, getMatchingItems, submitRating, submitReview, getPersonDetails, logoutUser, getTrendingMovies, getTrendingShows, getFilteredItems, loginUser, setFavourite, signupUser, getUserDetails, getGenreList, getMatchingPersons, followUser, getSeasonDetails };