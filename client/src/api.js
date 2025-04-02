import { cache } from "react";

const getLoggedIn = async () => {
    try {
        // TODO: Activate the below code
        
        // const response = await fasyncetch(`${apiUrl}/isLoggedIn`, {
            //   method: "GET",
            //   credentials: "include",
            // });
            // const data = await response.json();

        const data = { loggedIn: true };
        return data.loggedIn;
    } catch (err) {
        console.error("Error checking authentication status:", err);
    }
}

const getMovieDetails = async (movieId) => {
    const mockMovieDB = [
        {
            id: 1,
            title: "The Dark Knight",
            year: 2008,
            contentRating: "12A",
            rating: 9.0,
            duration: 152,
            user_rating: 4.8,
            popularity: 98,
            tags: ["Action", "Crime", "Drama", "Thriller"],
            director: "Christopher Nolan",
            writers: ["Jonathan Nolan", "Christopher Nolan"],
            actors: ["Christian Bale", "Heath Ledger", "Aaron Eckhart", "Michael Caine"],
            image: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_QL75_UX380_CR0,0,380,562_.jpg",
            description: "Batman has a new foe, the Joker, who is an accomplished criminal hell-bent on decimating Gotham City. Together with Gordon and Harvey Dent, Batman struggles to thwart the Joker before it is too late.",
            reviews: [
                { id: 3, rating: 5, text: "The Perfect Movie" },
                { id: 4, rating: 4, text: "Best Action Movie Ever" }
            ],
            recommended_movies: [2, 4, 6] // IDs of recommended movies
        },
        {
            id: 2,
            title: "The Godfather",
            year: 1972,
            contentRating: "15",
            rating: 9.2,
            duration: 175,
            user_rating: 4.9,
            popularity: 99,
            tags: ["Crime", "Drama"],
            director: "Francis Ford Coppola",
            writers: ["Mario Puzo", "Francis Ford Coppola"],
            actors: ["Marlon Brando", "Al Pacino", "James Caan", "Robert Duvall"],
            image: "https://m.media-amazon.com/images/M/MV5BNGEwYjgwOGQtYjg5ZS00Njc1LTk2ZGEtM2QwZWQ2NjdhZTE5XkEyXkFqcGc@._V1_QL75_UY281_CR4,0,190,281_.jpg",
            description: "Don Vito Corleone, head of a mafia family, decides to hand over his empire to his youngest son, Michael. However, his decision unintentionally puts the lives of his loved ones in grave danger.",
            reviews: [
                { id: 5, rating: 5, text: "The greatest film ever made" },
                { id: 6, rating: 5, text: "A cinematic masterpiece" }
            ],
            recommended_movies: [1, 3, 7]
        }
    ];

    try {
        const movie = mockMovieDB.find(movie => movie.id === parseInt(movieId));
        if (movie) {
            return movie;
        } else {
            throw new Error("Movie not found");
        }
    } catch (err) {
        console.error("Error retrieving movie details:", err);
        return null;
    }
}

// TODO: Properly integrate with API
const getMatchingItems = cache((text) => {
    const mockItems = [
        { id: 1, title: "The Dark Knight", image: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_QL75_UX380_CR0,0,380,562_.jpg", year: 2008, rating: 9.0, actors: ["Christian Bale", "Heath Ledger"] },
        { id: 2, title: "The Godfather", image: "https://m.media-amazon.com/images/M/MV5BNGEwYjgwOGQtYjg5ZS00Njc1LTk2ZGEtM2QwZWQ2NjdhZTE5XkEyXkFqcGc@._V1_QL75_UY281_CR4,0,190,281_.jpg", year: 1972, rating: 9.2, actors: ["Marlon Brando", "Al Pacino"] },
        { id: 3, title: "The Italian Job", image: "https://m.media-amazon.com/images/M/MV5BMjJjNzc5YjAtZjU2Ni00ZjVkLTkzYmItM2E2NDM0NWE1YmJhXkEyXkFqcGc@._V1_QL75_UX190_CR0,2,190,281_.jpg", year: 2003, rating: 7.0, actors: ["Mark Wahlberg", "Charlize Theron"] },
        { id: 4, title: "Zodiac", image: "https://m.media-amazon.com/images/M/MV5BNDFkMTRkZmQtM2I0NC00NjJjLWJlMDctNTNiZWYxYzhjZDZiXkEyXkFqcGc@._V1_QL75_UY281_CR0,0,190,281_.jpg", year: 2007, rating: 7.7, actors: ["Jake Gyllenhaal", "Robert Downey Jr."] },
        { id: 5, title: "Bourne Identity", image: "https://m.media-amazon.com/images/M/MV5BYTk1ZTcyMWMtMWUxYS00MmEzLTlmODYtOTk1MGRjOTg1ZjlmXkEyXkFqcGc@._V1_QL75_UX190_CR0,2,190,281_.jpg", year: 2002, rating: 7.9, actors: ["Matt Damon", "Franka Potente"] },
        { id: 6, title: "Schindler's List", image: "https://m.media-amazon.com/images/M/MV5BMTg3MDc4ODgyOF5BMl5BanBnXkFtZTgwNzY1ODIyNjM@._V1_QL75_UX190_CR0,10,190,281_.jpg", year: 1993, rating: 8.9, actors: ["Liam Neeson", "Ralph Fiennes"] },
        { id: 7, title: "1917", image: "https://m.media-amazon.com/images/M/MV5BYzkxZjg2NDQtMGVjMy00NWZkLTk0ZDEtZWE3NDYwYjAyMTg1XkEyXkFqcGc@._V1_QL75_UX190_CR0,10,190,281_.jpg", year: 2017, rating: 8.3, actors: ["George MacKay", "Dean-Charles Chapman"] }
    ];
    const matches = mockItems.filter(item => 
        item.title.toLowerCase().startsWith(text.toLowerCase())
    );
    return matches;
})

export { getLoggedIn, getMovieDetails, getMatchingItems };