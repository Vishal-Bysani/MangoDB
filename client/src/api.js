import { cache } from "react";
import { apiUrl } from "./config/config.js";

const handleApiError = (error) => {
    if (error.message === 'Failed to fetch') {
        window.location.href = '/network-error';
        return null;
    }
    throw error;
};

const getLoggedIn = async () => {
    try {
        const response = await fetch(`${apiUrl}/isLoggedIn`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        const data = await response.json();
        return data;
    } catch (error) {
        return handleApiError(error);
    }
}

const logoutUser = async () => {
    try {
        const response = await fetch(`${apiUrl}/logout`, {
            method: "POST",
            credentials: "include",
        });
        if (response.status !== 200) {
            throw new Error("Failed to log out");
        }
    } catch (error) {
        return handleApiError(error);
    }
}

const loginUser = async (user, password) => {
    try {
        const response = await fetch(`${apiUrl}/login`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user, password }),
        });
        return response;
    } catch (error) {
        return handleApiError(error);
    }
}

const signupUser = async (username, password, email) => {
    try {
        const response = await fetch(`${apiUrl}/signup`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password, email }),
        });
        return response;
    } catch (error) {
        return handleApiError(error);
    }
}

const getItemDetails = async (itemId) => {
    try {
        const response = await fetch(`${apiUrl}/getMovieShowDetails?id=${itemId}`, {
            credentials: "include",
        });
        const data = await response.json();
        return data;
    } catch (error) {
        return handleApiError(error);
    }
}

const getMatchingItems = async (text) => {
    try {
        const response = await fetch(`${apiUrl}/getMatchingItem?text=${text}`);
        const data = await response.json();
        return data;
    } catch (error) {
        return handleApiError(error);
    }
}

const submitRating = async (itemId, rating, forBook = false) => {
    try {
        if (forBook) {
            await fetch(`${apiUrl}/submitRatingReview?id=${itemId}&rating=${rating}&forBook=${forBook}`, {
                method: "POST",
                credentials: "include",
            });
            await fetch(`${apiUrl}/addToReadList?id=${itemId}`, {
                method: "POST",
                credentials: "include",
            });
        } else {
            await fetch(`${apiUrl}/submitRatingReview?id=${itemId}&rating=${rating}`, {
                method: "POST",
                credentials: "include",
            });
            await fetch(`${apiUrl}/addToWatchedList?id=${itemId}`, {
                method: "POST",
                credentials: "include",
            });
        }
    } catch (error) {
        return handleApiError(error);
    }
}

const submitReview = async (itemId, rating, review, forBook = false) => {
    try {
        if (forBook) {
            await fetch(`${apiUrl}/submitRatingReview?id=${itemId}&rating=${rating}&review=${review}&forBook=${forBook}`, {
                method: "POST",
                credentials: "include",
            });
            await fetch(`${apiUrl}/addToReadList?id=${itemId}`, {
                method: "POST",
                credentials: "include",
            });
        } else {
            await fetch(`${apiUrl}/submitRatingReview?id=${itemId}&rating=${rating}&review=${review}`, {
                method: "POST",
                credentials: "include",
            });
            await fetch(`${apiUrl}/addToWatchedList?id=${itemId}`, {
                method: "POST",
                credentials: "include",
            });
        }
    } catch (error) {
        return handleApiError(error);
    }
}

const getPersonDetails = async (personId) => {
    try {
        const response = await fetch(`${apiUrl}/getPersonDetails?id=${personId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        return handleApiError(error);
    }
}

const setFavourite = async (itemId, favourite, forBook = false) => {
    try {
        if (favourite) {
            if (forBook) {
                await fetch(`${apiUrl}/addToFavourites?id=${itemId}&forBook=${forBook}`, {
                    method: "POST",
                    credentials: "include",
                });
            } else {
                await fetch(`${apiUrl}/addToFavourites?id=${itemId}`, {
                    method: "POST",
                    credentials: "include",
                });
            }
        } else {
            if (forBook) {
                await fetch(`${apiUrl}/removeFromFavourites?id=${itemId}&forBook=${forBook}`, {
                    method: "POST",
                    credentials: "include",
                });
            } else {
                await fetch(`${apiUrl}/removeFromFavourites?id=${itemId}`, {
                    method: "POST",
                    credentials: "include",
                });
            }
        }
    } catch (error) {
        return handleApiError(error);
    }
}

const getTrendingMovies = async (pageNo = 1, pageLimit = 25) => {
    try {
        const response = await fetch(`${apiUrl}/getMoviesByPopularity?pageNo=${pageNo}&pageLimit=${pageLimit}`, {
            credentials: "include",
        });
        const data = await response.json();
        return data.movies;
    } catch (error) {
        return handleApiError(error);
    }
}

const getTrendingShows = async (pageNo = 1, pageLimit = 25) => {
    try {
        const response = await fetch(`${apiUrl}/getShowsByPopularity?pageNo=${pageNo}&pageLimit=${pageLimit}`, {
            credentials: "include",
        });
        const data = await response.json();
        return data.shows;
    } catch (error) {
        return handleApiError(error);
    }
}

export const getTrendingBooks = async (pageNo = 1, pageLimit = 25) => {
    try {
        const response = await fetch(`${apiUrl}/getBooksByPopularity?pageNo=${pageNo}&pageLimit=${pageLimit}`, {
            credentials: "include",
        });
        const data = await response.json();
        return data.books;
    } catch (error) {
        return handleApiError(error);
    }
}

const getFilteredItems = async ({searchText = null,
                                personId = null,
                                genreId = null,
                                year = null,
                                minRating = null,
                                orderByRating = false,
                                orderByPopularity = false,
                                forBook = true,
                                forMovie = true,
                                forShow = true,
                                pageNo = 1,
                                pageLimit = 10 }) => {
    try {
        let baseUrl = `${apiUrl}/filterItems?`;
        if (searchText) baseUrl += `searchText=${searchText}&`;
        if (personId) baseUrl += `personId=${personId}&`;
        if (genreId) baseUrl += `genreId=${genreId}&`;
        if (year) baseUrl += `year=${year}&`;
        if (minRating) baseUrl += `minRating=${minRating}&`;
        if (orderByRating) baseUrl += `orderByRating=${orderByRating}&`;
        if (orderByPopularity) baseUrl += `orderByPopularity=${orderByPopularity}&`;
        if (forBook) baseUrl += `forBook=${forBook}&`;
        if (forMovie) baseUrl += `forMovie=${forMovie}&`;
        if (forShow) baseUrl += `forShow=${forShow}&`;
        if (pageNo) baseUrl += `pageNo=${pageNo}&`;
        if (pageLimit) baseUrl += `pageLimit=${pageLimit}&`;
        
        const response = await fetch(baseUrl, {
            credentials: "include",
        });
        const data = await response.json();
        if (data.moviesOrShows) return data.moviesOrShows.concat(data.books);
        else return data.books;
    } catch (error) {
        return handleApiError(error);
    }
}

const getUserDetails = async (username) => {
    try {
        const userDetails = await fetch(`${apiUrl}/getUserDetails?username=${username}`, {
            method: "GET",
            credentials: "include",
        });
        if (userDetails.status != 200) return null;
        const userDetailsData = await userDetails.json();
        return userDetailsData;
    } catch (error) {
        return handleApiError(error);
    }
}

const getGenreList = async () => {
    try {
        const response = await fetch(`${apiUrl}/listGenres`);
        const data = await response.json();
        return data;
    } catch (error) {
        return handleApiError(error);
    }
}

const getMatchingPersons = async (searchText, searchLimit = 100) => {
    try {
        const response = await fetch(`${apiUrl}/matchingPersons?searchText=${searchText}&searchLimit=${searchLimit}`);
        const data = await response.json();
        return data;
    } catch (error) {
        return handleApiError(error);
    }
}

const followUser = async (followedUsername) => {
    try {
        const response = await fetch(`${apiUrl}/followUser?followed_username=${followedUsername}`, {
            method: "POST",
            credentials: "include",
        });
        const data = await response.json();
        return data;
    } catch (error) {
        return handleApiError(error);
    }
}

const toggleWatchListed = async (itemId, watchListed) => {
    try {
        if (watchListed) {
            await fetch(`${apiUrl}/addToWatchlist?id=${itemId}`, {
                method: "POST",
                credentials: "include",
            });
        } else {
            await fetch(`${apiUrl}/removeFromWatchlist?id=${itemId}`, {
                method: "POST",
                credentials: "include",
            });
        }
    } catch (error) {
        return handleApiError(error);
    }
}

const getSeasonDetails = async (showId, seasonId) => {
    try {
        const response = await fetch(`${apiUrl}/getSeasonDetails?show_id=${showId}&season_id=${seasonId}`, {
            credentials: "include",
        });
        const data = await response.json();
        return data;
    } catch (error) {
        return handleApiError(error);
    }
}

const getCollectionDetails = async (collectionId, pageNo = 1, pageLimit = 1000) => {
    try {
        const response = await fetch(`${apiUrl}/getMovieShowByCollectionId?collection_id=${collectionId}&pageNo=${pageNo}&pageLimit=${pageLimit}`, {
            credentials: "include",
        });
        const data = await response.json();
        return data;
    } catch (error) {
        return handleApiError(error);
    }
}

const getBookDetails = async (bookId) => {
    try {
        const response = await fetch(`${apiUrl}/getBooksDetails?id=${bookId}`, {
            credentials: "include",
        });
        const data = await response.json();
        return data;
    } catch (error) {
        return handleApiError(error);
    }
}

const toggleWantToReadListed = async (itemId, readListed) => {
    try {
        if (readListed) {
            await fetch(`${apiUrl}/addToWantToReadList?id=${itemId}`, {
                method: "POST",
                credentials: "include",
            });
        } else {
            await fetch(`${apiUrl}/removeFromWantToReadList?id=${itemId}`, {
                method: "POST",
                credentials: "include",
            });
        }
    } catch (error) {
        return handleApiError(error);
    }
}

export const uploadProfileImage = async (imageFile, username) => {
    try {
        const formData = new FormData();
        formData.append('profileImage', imageFile);
        formData.append('username', username);
        console.log("Uploading image to server...");
        const response = await fetch(`${apiUrl}/uploadProfilePicture`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            credentials: "include",
            body: formData
        });
        
        if (response.status !== 200) {
            throw new Error(`Image upload failed: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        return handleApiError(error);
    }
};

export { toggleWatchListed, toggleWantToReadListed, getBookDetails, getCollectionDetails, getLoggedIn, getItemDetails, getMatchingItems, submitRating, submitReview, getPersonDetails, logoutUser, getTrendingMovies, getTrendingShows, getFilteredItems, loginUser, setFavourite, signupUser, getUserDetails, getGenreList, getMatchingPersons, followUser, getSeasonDetails };