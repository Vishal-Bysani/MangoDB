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

const getItemReviews = async (itemId, page = 1, limit = 5) => {
    const mockReviewDb = [
        {
            itemId: 1,
            title: "The Dark Knight",
            reviews: [
                {
                    reviewId: 1,
                    userId: 101,
                    username: "joker_fan",
                    rating: 9.5,
                    text: "Heath Ledger's performance as the Joker is absolutely legendary. The movie redefined what a superhero film could be.",
                    date: "2023-05-15"
                },
                {
                    reviewId: 2,
                    userId: 102,
                    username: "batman_forever",
                    rating: 8.0,
                    text: "While the action sequences are incredible, some of the plot points feel a bit contrived. Still, a solid entry in the Batman franchise.",
                    date: "2023-06-20"
                },
                {
                    reviewId: 3,
                    userId: 103,
                    username: "cinema_buff",
                    rating: 9.8,
                    text: "A masterpiece of cinema. Brando's performance as Don Corleone is simply unforgettable. The cinematography and score are perfect.",
                    date: "2023-04-10"
                },
                {
                    reviewId: 4,
                    userId: 104,
                    username: "movie_critic",
                    rating: 9.0,
                    text: "The Godfather stands the test of time as one of the greatest films ever made. The family dynamics and moral complexity are brilliantly portrayed.",
                    date: "2023-07-05"
                },
                {
                    reviewId: 5,
                    userId: 105,
                    username: "movie_lover",
                    rating: 8.5,
                    text: "A must-watch for any fan of the genre. The Dark Knight is a masterpiece of storytelling and character development.",
                    date: "2023-08-15"
                },
                {
                    reviewId: 6,
                    userId: 106,
                    username: "movie_lover",
                    rating: 8.5,
                    text: "A must-watch for any fan of the genre. The Dark Knight is a masterpiece of storytelling and character development.",
                    date: "2023-08-15"
                },
                {
                    reviewId: 7,
                    userId: 107,
                    username: "movie_lover",
                    rating: 8.5,
                    text: "The Dark Knight is a masterpiece of storytelling and character development.",
                    date: "2023-08-15"
                },
                {
                    reviewId: 8,
                    userId: 108,
                    username: "movie_lover",
                    rating: 8.5,
                    text: "Very good movie",
                    date: "2023-08-15"
                },
                {
                    reviewId: 9,
                    userId: 109,
                    username: "movie_lover",
                    rating: 8.5,
                    text: "The Dark Knight is a masterpiece of storytelling and character development.",
                    date: "2023-08-15"
                },
                {
                    reviewId: 10,
                    userId: 110,
                    username: "movie_lover",
                    rating: 8.5,
                    text: "The Dark Knight is a masterpiece of storytelling and character development.",
                    date: "2023-08-15"
                },
                {
                    reviewId: 11,
                    userId: 111,
                    username: "movie_lover",
                    rating: 8.5,
                    text: "The Dark Knight is a masterpiece of storytelling and character development.",
                    date: "2023-08-15"
                },
                {
                    reviewId: 12,
                    userId: 112,
                    username: "movie_lover",
                    rating: 8.5,
                    text: "The Dark Knight is a masterpiece of storytelling and character development.",
                    date: "2023-08-15"
                }
            ]
        },
        {
            itemId: 2,
            title: "The Godfather",
            reviews: [
                {
                    reviewId: 3,
                    userId: 103,
                    username: "cinema_buff",
                    rating: 9.8,
                    text: "A masterpiece of cinema. Brando's performance as Don Corleone is simply unforgettable. The cinematography and score are perfect.",
                    date: "2023-04-10"
                },
                {
                    reviewId: 4,
                    userId: 104,
                    username: "movie_critic",
                    rating: 9.0,
                    text: "The Godfather stands the test of time as one of the greatest films ever made. The family dynamics and moral complexity are brilliantly portrayed.",
                    date: "2023-07-05"
                }
            ]
        }
    ];
    try {
        const match = mockReviewDb.find(review => parseInt(review.itemId) === parseInt(itemId));
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedReviews = match.reviews.slice(startIndex, endIndex);
        return {
            title: match.title,
            totalReviews: match.reviews.length,
            currentPage: page,
            totalPages: Math.ceil(match.reviews.length / limit),
            reviews: paginatedReviews,
        };
    } catch (err) {
        console.error("Error retrieving item reviews:", err);
        return null;
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

export { toggleWatchListed, getCollectionDetails, getLoggedIn, getItemDetails, getMatchingItems, submitRating, submitReview, getPersonDetails, getItemReviews, logoutUser, getTrendingMovies, getTrendingShows, getFilteredItems, loginUser, setFavourite, signupUser, getUserDetails, getGenreList, getMatchingPersons, followUser, getSeasonDetails };