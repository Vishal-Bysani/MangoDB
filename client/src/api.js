import { cache } from "react";
import { apiUrl } from "./config/config.js";
import { Navigate } from "react-router";

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
    const response = await fetch(`${apiUrl}/getMovieShowDetails?id=${itemId}`);
    const data = await response.json();
    console.log(data);
    return data;
}

// TODO: Properly integrate with API
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
    console.log("Received rating: " + rating)
}

const submitReview = async (itemId, rating, review) => {
    fetch(`${apiUrl}/submitEpisodeRatingReview?id=${itemId}&rating=${rating}&review=${review}`, {
        method: "POST",
        credentials: "include",
    });
    console.log("Received review: " + review)
}

const getPersonDetails = async (personId) => {
    const response = await fetch(`${apiUrl}/getPersonDetails?id=${personId}`);
    const data = await response.json();
    return data;
}

const toggleFavorite = async (itemId) => {
    // TODO
    console.log("Toggling favorite for item: " + itemId)
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

const getFilteredItems = async ({personId = null,
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
    return [
        { itemId: 8, title: "The Office", rating: 9.0, image: "https://m.media-amazon.com/images/M/MV5BZjQwYzBlYzUtZjhhOS00ZDQ0LWE0NzAtYTk4MjgzZTNkZWEzXkEyXkFqcGc@._V1_QL75_UX190_CR0,2,190,281_.jpg", year: 2008 },
        { itemId: 8, title: "The Office", rating: 9.0, image: "https://m.media-amazon.com/images/M/MV5BZjQwYzBlYzUtZjhhOS00ZDQ0LWE0NzAtYTk4MjgzZTNkZWEzXkEyXkFqcGc@._V1_QL75_UX190_CR0,2,190,281_.jpg", year: 2008 },
        { itemId: 8, title: "The Office", rating: 9.0, image: "https://m.media-amazon.com/images/M/MV5BZjQwYzBlYzUtZjhhOS00ZDQ0LWE0NzAtYTk4MjgzZTNkZWEzXkEyXkFqcGc@._V1_QL75_UX190_CR0,2,190,281_.jpg", year: 2008 },
        { itemId: 8, title: "The Office", rating: 9.0, image: "https://m.media-amazon.com/images/M/MV5BZjQwYzBlYzUtZjhhOS00ZDQ0LWE0NzAtYTk4MjgzZTNkZWEzXkEyXkFqcGc@._V1_QL75_UX190_CR0,2,190,281_.jpg", year: 2008 },
        { itemId: 8, title: "The Office", rating: 9.0, image: "https://m.media-amazon.com/images/M/MV5BZjQwYzBlYzUtZjhhOS00ZDQ0LWE0NzAtYTk4MjgzZTNkZWEzXkEyXkFqcGc@._V1_QL75_UX190_CR0,2,190,281_.jpg", year: 2008 },
    ];
}

const getUserDetails = async () => {
    // TODO
    return {
        userId: 101,
        username: "Atharva",
        joinDate: "2023-04-10",
        favorites: [
            { itemId: 1, title: "The Dark Knight", rating: 9.0, userRating: 10, image: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_QL75_UX380_CR0,0,380,562_.jpg", year: 2008 },
            { itemId: 2, title: "The Godfather", rating: 9.0, userRating: 10, image: "https://m.media-amazon.com/images/M/MV5BNGEwYjgwOGQtYjg5ZS00Njc1LTk2ZGEtM2QwZWQ2NjdhZTE5XkEyXkFqcGc@._V1_QL75_UY281_CR4,0,190,281_.jpg", year: 1972 },
        ],
        watchlist: [
            { itemId: 2, title: "The Godfather", rating: 9.0, userRating: 10, image: "https://m.media-amazon.com/images/M/MV5BNGEwYjgwOGQtYjg5ZS00Njc1LTk2ZGEtM2QwZWQ2NjdhZTE5XkEyXkFqcGc@._V1_QL75_UY281_CR4,0,190,281_.jpg", year: 1972 },
            { itemId: 1, title: "The Dark Knight", rating: 9.0, userRating: 10, image: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_QL75_UX380_CR0,0,380,562_.jpg", year: 2008 },
        ],
        reviews: [
            { itemId: 1, title: "The Dark Knight", reviewId: 1, rating: 9.0, text: "This is a review", date: "2023-04-10" },
            { itemId: 2, title: "The Godfather", reviewId: 2, rating: 9.0, text: "This is a review", date: "2023-04-10" },
        ]
    }
}

export { getLoggedIn, getItemDetails, getMatchingItems, submitRating, submitReview, getPersonDetails, getItemReviews, logoutUser, getTrendingMovies, getTrendingShows, getFilteredItems, loginUser, toggleFavorite, signupUser, getUserDetails };