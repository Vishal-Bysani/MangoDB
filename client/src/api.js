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

const getItemDetails = async (itemId) => {
    const mockItemDB = [
        {
            id: 1,
            title: "The Dark Knight",
            startYear: 2008,
            endYear: null,
            type: "movie",
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
            recommended_movies: [2, 4, 6] // IDs of recommended items
        },
        {
            id: 2,
            title: "The Godfather",
            startYear: 1972,
            endYear: null,
            type: "movie",
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
            recommended_items: [1, 3, 7]
        },
        {
            id: 8,
            title: "The Office",
            startYear: 2005,
            endYear: 2013,
            type: "tvseries",
            contentRating: "15",
            rating: 9.0,
            duration: 22,
            user_rating: 4.8,
            popularity: 95,
            tags: ["Comedy", "Drama"],
            director: "Greg Daniels",
            writers: ["Greg Daniels", "Ricky Gervais", "Stephen Merchant"],
            actors: ["Steve Carell", "Jenna Fischer", "John Krasinski"],
            image: "https://m.media-amazon.com/images/M/MV5BZjQwYzBlYzUtZjhhOS00ZDQ0LWE0NzAtYTk4MjgzZTNkZWEzXkEyXkFqcGc@._V1_QL75_UX190_CR0,2,190,281_.jpg",
            description: "A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium.",
            reviews: [
                { id: 7, rating: 5, text: "One of the best TV shows ever made" },
                { id: 8, rating: 5, text: "Pure comedy gold" }
            ],
            recommended_items: [2, 4, 6]
        }
    ];

    try {
        const item = mockItemDB.find(item => item.id === parseInt(itemId));
        if (item) {
            return item;
        } else {
            throw new Error("Item not found");
        }
    } catch (err) {
        console.error("Error retrieving item details:", err);
        return null;
    }
}

// TODO: Properly integrate with API
const getMatchingItems = cache((text) => {
    const mockItems = [
        { id: 1, title: "The Dark Knight", type: "movie", image: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_QL75_UX380_CR0,0,380,562_.jpg", startYear: 2008, endYear: null, rating: 9.0, actors: ["Christian Bale", "Heath Ledger"] },
        { id: 2, title: "The Godfather", type: "movie", image: "https://m.media-amazon.com/images/M/MV5BNGEwYjgwOGQtYjg5ZS00Njc1LTk2ZGEtM2QwZWQ2NjdhZTE5XkEyXkFqcGc@._V1_QL75_UY281_CR4,0,190,281_.jpg", startYear: 1972, endYear: null, rating: 9.2, actors: ["Marlon Brando", "Al Pacino"] },
        { id: 3, title: "The Italian Job", type: "movie", image: "https://m.media-amazon.com/images/M/MV5BMjJjNzc5YjAtZjU2Ni00ZjVkLTkzYmItM2E2NDM0NWE1YmJhXkEyXkFqcGc@._V1_QL75_UX190_CR0,2,190,281_.jpg", startYear: 2003, endYear: null, rating: 7.0, actors: ["Mark Wahlberg", "Charlize Theron"] },
        { id: 4, title: "Zodiac", type: "movie", image: "https://m.media-amazon.com/images/M/MV5BNDFkMTRkZmQtM2I0NC00NjJjLWJlMDctNTNiZWYxYzhjZDZiXkEyXkFqcGc@._V1_QL75_UY281_CR0,0,190,281_.jpg", startYear: 2007, endYear: null, rating: 7.7, actors: ["Jake Gyllenhaal", "Robert Downey Jr."] },
        { id: 5, title: "Bourne Identity", type: "movie", image: "https://m.media-amazon.com/images/M/MV5BYTk1ZTcyMWMtMWUxYS00MmEzLTlmODYtOTk1MGRjOTg1ZjlmXkEyXkFqcGc@._V1_QL75_UX190_CR0,2,190,281_.jpg", startYear: 2002, endYear: null, rating: 7.9, actors: ["Matt Damon", "Franka Potente"] },
        { id: 6, title: "Schindler's List", type: "movie", image: "https://m.media-amazon.com/images/M/MV5BMTg3MDc4ODgyOF5BMl5BanBnXkFtZTgwNzY1ODIyNjM@._V1_QL75_UX190_CR0,10,190,281_.jpg", startYear: 1993, endYear: null, rating: 8.9, actors: ["Liam Neeson", "Ralph Fiennes"] },
        { id: 7, title: "1917", type: "movie", image: "https://m.media-amazon.com/images/M/MV5BYzkxZjg2NDQtMGVjMy00NWZkLTk0ZDEtZWE3NDYwYjAyMTg1XkEyXkFqcGc@._V1_QL75_UX190_CR0,10,190,281_.jpg", startYear: 2019, endYear: null, rating: 8.3, actors: ["George MacKay", "Dean-Charles Chapman"] },
        { id: 8, title: "The Office", type: "tvseries", image: "https://m.media-amazon.com/images/M/MV5BZjQwYzBlYzUtZjhhOS00ZDQ0LWE0NzAtYTk4MjgzZTNkZWEzXkEyXkFqcGc@._V1_QL75_UX190_CR0,2,190,281_.jpg", startYear: 2005, endYear: 2013, rating: 9.0, actors: ["Steve Carell", "Jenna Fischer", "John Krasinski"] },
        { id: 9, title: "Inception", type: "movie", image: "https://m.media-amazon.com/images/M/MV5BMjExMjkwNTQ0Nl5BMl5BanBnXkFtZTcwNTY0OTk1Mw@@._V1_QL75_UX190_CR0,0,190,281_.jpg", startYear: 2010, endYear: null, rating: 8.8, actors: ["Leonardo DiCaprio", "Joseph Gordon-Levitt"] },
    ]
    const matches = mockItems.filter(item => 
        item.title.toLowerCase().startsWith(text.toLowerCase())
    );
    return matches;
})

export { getLoggedIn, getItemDetails, getMatchingItems };