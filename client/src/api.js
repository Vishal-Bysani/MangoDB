import { cache } from "react";
import { apiUrl } from "./config/config.js";

const getLoggedIn = async () => {
    try {
        const response = await fetch(`${apiUrl}/isLoggedIn`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        // return response.json();
        return Promise.resolve({loggedIn: true, userName: "John Doe"});
    } catch (err) {
        console.error("Error checking authentication status:", err);
    }
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

const loginUser = async (email, password) => {
    return fetch(`${apiUrl}/login`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });
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
            numRating: 1434004,
            duration: 152,
            user_rating: 4.8,
            popularity: 98,
            favorite: true,
            tags: [
                { id: 1001, name: "Action" },
                { id: 1002, name: "Crime" },
                { id: 1003, name: "Drama" },
                { id: 1004, name: "Thriller" }
            ],
            director: { id: 301, name: "Christopher Nolan" },
            writers: [
                { id: 302, name: "Jonathan Nolan" },
                { id: 303, name: "Christopher Nolan" }
            ],
            actors: [
                { id: 101, name: "Christian Bale", character: "Bruce Wayne / Batman", imageLink: "https://m.media-amazon.com/images/M/MV5BMTkxMzk4MjQ4MF5BMl5BanBnXkFtZTcwMzExODQxOA@@._V1_QL75_UX190_CR0,0,190,281_.jpg" },
                { id: 102, name: "Heath Ledger", character: "Joker", imageLink: "https://example.com/heath_ledger.jpg" },
                { id: 103, name: "Aaron Eckhart", character: "Harvey Dent / Two-Face", imageLink: "https://example.com/aaron_eckhart.jpg" },
                { id: 104, name: "Michael Caine", character: "Alfred", imageLink: "https://example.com/michael_caine.jpg" },
                { id: 201, name: "Marlon Brando", character: "Don Vito Corleone", imageLink: "https://example.com/marlon_brando.jpg" },
                { id: 202, name: "Al Pacino", character: "Michael Corleone", imageLink: "https://example.com/al_pacino.jpg" },
                { id: 203, name: "James Caan", character: "Sonny Corleone", imageLink: "https://example.com/james_caan.jpg" },
                { id: 204, name: "Robert Duvall", character: "Tom Hagen", imageLink: "https://example.com/robert_duvall.jpg" },
                { id: 801, name: "Steve Carell", character: "Michael Scott", imageLink: "https://example.com/steve_carell.jpg" },
                { id: 802, name: "Jenna Fischer", character: "Pam Beesly", imageLink: "https://example.com/jenna_fischer.jpg" },
                { id: 803, name: "John Krasinski", character: "Jim Halpert", imageLink: "https://example.com/john_krasinski.jpg" }
            ],
            image: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_QL75_UX380_CR0,0,380,562_.jpg",
            description: "Batman has a new foe, the Joker, who is an accomplished criminal hell-bent on decimating Gotham City. Together with Gordon and Harvey Dent, Batman struggles to thwart the Joker before it is too late.",
            reviews: [
                { id: 3, rating: 5, text: "The Perfect Movie", user_id: 1001 },
                { id: 4, rating: 4, text: "Best Action Movie Ever", user_id: 1002 }
            ],
            recommended_movies: [2, 4, 6],
            productionCompany: "Warner Bros. Pictures",
            country: "United States",
            trailerLink: "https://www.youtube.com/watch?v=EXeTwQWrcwY"
        },
        {
            id: 2,
            title: "The Godfather",
            startYear: 1972,
            endYear: null,
            type: "movie",
            contentRating: "15",
            rating: 9.2,
            numRating: 400040,
            duration: 175,
            user_rating: null,
            popularity: 99,
            favorite: false,
            tags: [
                { id: 1002, name: "Crime" },
                { id: 1003, name: "Drama" }
            ],
            director: { id: 401, name: "Francis Ford Coppola" },
            writers: [
                { id: 402, name: "Mario Puzo" },
                { id: 403, name: "Francis Ford Coppola" }
            ],
            actors: [
                { id: 201, name: "Marlon Brando", character: "Don Vito Corleone", imageLink: "https://example.com/marlon_brando.jpg" },
                { id: 202, name: "Al Pacino", character: "Michael Corleone", imageLink: "https://example.com/al_pacino.jpg" },
                { id: 203, name: "James Caan", character: "Sonny Corleone", imageLink: "https://example.com/james_caan.jpg" },
                { id: 204, name: "Robert Duvall", character: "Tom Hagen", imageLink: "https://example.com/robert_duvall.jpg" }
            ],
            image: "https://m.media-amazon.com/images/M/MV5BNGEwYjgwOGQtYjg5ZS00Njc1LTk2ZGEtM2QwZWQ2NjdhZTE5XkEyXkFqcGc@._V1_QL75_UY281_CR4,0,190,281_.jpg",
            description: "Don Vito Corleone, head of a mafia family, decides to hand over his empire to his youngest son, Michael. However, his decision unintentionally puts the lives of his loved ones in grave danger.",
            reviews: [
                { id: 5, rating: 5, text: "The greatest film ever made", user_id: 1003 },
                { id: 6, rating: 5, text: "A cinematic masterpiece", user_id: 1004 }
            ],
            recommended_items: [1, 3, 7],
            productionCompany: "Paramount Pictures",
            country: "United States",
            trailerLink: "https://www.youtube.com/watch?v=sY1S34973zA"
        },
        {
            id: 8,
            title: "The Office",
            startYear: 2005,
            endYear: 2013,
            type: "tvseries",
            contentRating: "15",
            rating: 9.0,
            numRating: 1600040,
            duration: 22,
            user_rating: 4.8,
            popularity: 95,
            favorite: true,
            tags: [
                { id: 1005, name: "Comedy" },
                { id: 1003, name: "Drama" }
            ],
            director: { id: 501, name: "Greg Daniels" },
            writers: [
                { id: 502, name: "Greg Daniels" },
                { id: 503, name: "Ricky Gervais" },
                { id: 504, name: "Stephen Merchant" }
            ],
            actors: [
                { id: 801, name: "Steve Carell", character: "Michael Scott", imageLink: "https://example.com/steve_carell.jpg" },
                { id: 802, name: "Jenna Fischer", character: "Pam Beesly", imageLink: "https://example.com/jenna_fischer.jpg" },
                { id: 803, name: "John Krasinski", character: "Jim Halpert", imageLink: "https://example.com/john_krasinski.jpg" }
            ],
            image: "https://m.media-amazon.com/images/M/MV5BZjQwYzBlYzUtZjhhOS00ZDQ0LWE0NzAtYTk4MjgzZTNkZWEzXkEyXkFqcGc@._V1_QL75_UX190_CR0,2,190,281_.jpg",
            description: "A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium.",
            reviews: [
                { id: 7, rating: 5, text: "One of the best TV shows ever made", user_id: 1005 },
                { id: 8, rating: 5, text: "Pure comedy gold", user_id: 1006 }
            ],
            recommended_items: [2, 4, 6],
            productionCompany: "NBC Universal Television",
            country: "United States",
            trailerLink: "https://www.youtube.com/watch?v=-C2z-nshFts"
        },
        {
            id: 11,
            title: "American Psycho",
            startYear: 2000,
            endYear: null,
            type: "movie",
            contentRating: "18",
            rating: 7.6,
            numRating: 1000000,
            duration: 102,
            user_rating: null,
            popularity: 90,
            tags: [
                { id: 1002, name: "Crime" },
                { id: 1003, name: "Drama" }
            ],
            director: { id: 601, name: "Mary Harron" },
            writers: [
                { id: 602, name: "Bret Easton Ellis" },
                { id: 603, name: "Mary Harron" }
            ],
            actors: [
                { id: 101, name: "Christian Bale", character: "Patrick Bateman", imageLink: "https://example.com/christian_bale.jpg" },
                { id: 902, name: "Willem Dafoe", character: "Donald Kimball", imageLink: "https://example.com/willem_dafoe.jpg" }
            ],
            image: "https://m.media-amazon.com/images/M/MV5BNzBjM2I5ZjUtNmIzNy00OGNkLWIwZDMtOTAwYWUwMzA2YjdlXkEyXkFqcGc@._V1_QL75_UX190_CR0,0,190,281_.jpg",
            description: "A wealthy New York investment banker who is a psychopath and serial killer.",
            reviews: [
                { id: 9, rating: 7.6, text: "A dark and disturbing film that explores the dark side of wealth and ambition.", user_id: 1007 }
            ],
            recommended_items: [1, 2, 3],
            productionCompany: "Warner Bros. Pictures",
            country: "United States",
            trailerLink: "https://www.youtube.com/watch?v=81mibtQWWBg"
        }
    ];

    try {
        const item = mockItemDB.find(item => item.id === parseInt(itemId));
        return item;
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
        { id: 10, title: "The Dark Knight Rises", type: "movie", image: "https://m.media-amazon.com/images/M/MV5BMTk4ODQzNDY3Ml5BMl5BanBnXkFtZTcwODA0NTM4Nw@@._V1_QL75_UX190_CR0,0,190,281_.jpg", startYear: 2012, endYear: null, rating: 8.4, actors: ["Christian Bale", "Tom Hardy"] },
        { id: 11, title: "American Psycho", type: "movie", image: "https://m.media-amazon.com/images/M/MV5BNzBjM2I5ZjUtNmIzNy00OGNkLWIwZDMtOTAwYWUwMzA2YjdlXkEyXkFqcGc@._V1_QL75_UX190_CR0,0,190,281_.jpg", startYear: 2000, endYear: null, rating: 7.6, actors: ["Christian Bale", "Willem Dafoe"] },
    ]
    try {
        const matches = mockItems.filter(item => 
            item.title.toLowerCase().startsWith(text.toLowerCase())
        );
        return matches;
    } catch (err) {
        console.error("Error retrieving matching items:", err);
        return null;
    }
})

const submitRating = async (rating) => {
    // TODO
    console.log("Received rating: " + rating)
}

const submitReview = async (rating) => {
    // TODO
    console.log("Received review: " + rating)
}

const getPersonDetails = async (personId) => {
    // TODO
    const mockPersonDb = [
        {
            id: 101,
            name: "Christian Bale",
            roles: ["Actor"],
            imageLink: "https://m.media-amazon.com/images/M/MV5BMTkxMzk4MjQ4MF5BMl5BanBnXkFtZTcwMzExODQxOA@@._V1_QL75_UX190_CR0,0,190,281_.jpg",
            description: "Christian Charles Philip Bale is an English actor. Known for his versatility and physical transformations for his roles, he has been a leading man in films of several genres.",
            knownFor: [
                { itemId: 1, title: "The Dark Knight", rating: 9.0, imageLink: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_QL75_UX380_CR0,0,380,562_.jpg", year: 2008 },
                { itemId: 6, title: "Schindler's List", rating: 8.9, imageLink: "https://m.media-amazon.com/images/M/MV5BMTg3MDc4ODgyOF5BMl5BanBnXkFtZTgwNzY1ODIyNjM@._V1_QL75_UX190_CR0,10,190,281_.jpg", year: 1993 },
                { itemId: 9, title: "Inception", rating: 8.8, imageLink: "https://m.media-amazon.com/images/M/MV5BMjExMjkwNTQ0Nl5BMl5BanBnXkFtZTcwNTY0OTk1Mw@@._V1_QL75_UX190_CR0,0,190,281_.jpg", year: 2010 },
                { itemId: 11, title: "American Psycho", rating: 7.6, imageLink: "https://m.media-amazon.com/images/M/MV5BNzBjM2I5ZjUtNmIzNy00OGNkLWIwZDMtOTAwYWUwMzA2YjdlXkEyXkFqcGc@._V1_QL75_UX190_CR0,0,190,281_.jpg", year: 2000 }
            ],
            dateOfBirth: "1974-01-30",
            dateOfDeath: null,
            popularity: 95,
            awards: [
                { awardId: 1, organizationName: "Academy Awards", yearReceived: 2011, item: { itemId: 1, title: "The Dark Knight" } },
                { awardId: 2, organizationName: "Golden Globe Awards", yearReceived: 2011, item: { itemId: 1, title: "The Dark Knight" } }
            ]
        },
        {
            id: 102,
            name: "Heath Ledger",
            roles: ["Actor"],
            imageLink: "https://m.media-amazon.com/images/M/MV5BMTI2NTY0NzA4MF5BMl5BanBnXkFtZTYwMjE1MDE0._V1_QL75_UX190_CR0,0,190,281_.jpg",
            description: "Heath Andrew Ledger was an Australian actor and music video director. After performing roles in several Australian television and film productions during the 1990s, Ledger moved to the United States in 1998 to further develop his film career.",
            knownFor: [
                { itemId: 1, title: "The Dark Knight", rating: 9.0, imageLink: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_QL75_UX380_CR0,0,380,562_.jpg", year: 2008 },
                { itemId: 3, title: "The Italian Job", rating: 7.0, imageLink: "https://m.media-amazon.com/images/M/MV5BMjJjNzc5YjAtZjU2Ni00ZjVkLTkzYmItM2E2NDM0NWE1YmJhXkEyXkFqcGc@._V1_QL75_UX190_CR0,2,190,281_.jpg", year: 2003 },
                { itemId: 4, title: "Zodiac", rating: 7.7, imageLink: "https://m.media-amazon.com/images/M/MV5BNDFkMTRkZmQtM2I0NC00NjJjLWJlMDctNTNiZWYxYzhjZDZiXkEyXkFqcGc@._V1_QL75_UY281_CR0,0,190,281_.jpg", year: 2007 }
            ],
            dateOfBirth: "1979-04-04",
            dateOfDeath: "2008-01-22",
            popularity: 98,
            awards: [
                { awardId: 3, organizationName: "Academy Awards", yearReceived: 2009, item: { itemId: 1, title: "The Dark Knight" } },
                { awardId: 4, organizationName: "Golden Globe Awards", yearReceived: 2009, item: { itemId: 1, title: "The Dark Knight" } }
            ]
        },
        {
            id: 201,
            name: "Marlon Brando",
            roles: ["Actor", "Director", "Producer"],
            imageLink: "https://m.media-amazon.com/images/M/MV5BMTg3MDYyMDE5OF5BMl5BanBnXkFtZTcwNjgyNTEzNA@@._V1_QL75_UY207_CR64,0,140,207_.jpg",
            description: "Marlon Brando Jr. was an American actor and film director. He is credited with bringing realism to film acting.",
            knownFor: [
                { itemId: 2, title: "The Godfather", rating: 9.2, imageLink: "https://m.media-amazon.com/images/M/MV5BNGEwYjgwOGQtYjg5ZS00Njc1LTk2ZGEtM2QwZWQ2NjdhZTE5XkEyXkFqcGc@._V1_QL75_UY281_CR4,0,190,281_.jpg", year: 1972 },
                { itemId: 6, title: "Schindler's List", rating: 8.9, imageLink: "https://m.media-amazon.com/images/M/MV5BMTg3MDc4ODgyOF5BMl5BanBnXkFtZTgwNzY1ODIyNjM@._V1_QL75_UX190_CR0,10,190,281_.jpg", year: 1993 },
                { itemId: 7, title: "1917", rating: 8.3, imageLink: "https://m.media-amazon.com/images/M/MV5BYzkxZjg2NDQtMGVjMy00NWZkLTk0ZDEtZWE3NDYwYjAyMTg1XkEyXkFqcGc@._V1_QL75_UX190_CR0,10,190,281_.jpg", year: 2019 }
            ],
            dateOfBirth: "1924-04-03",
            dateOfDeath: "2004-07-01",
            popularity: 97,
            awards: [
                { awardId: 5, organizationName: "Academy Awards", yearReceived: 1973, item: { itemId: 2, title: "The Godfather" } },
                { awardId: 6, organizationName: "Golden Globe Awards", yearReceived: 1973, item: { itemId: 2, title: "The Godfather" } }
            ]
        }
    ]
    try {
        const matches = mockPersonDb.find(person =>
            person.id === parseInt(personId)
        );
        return matches;
    } catch (err) {
        console.error("Error retrieving person details:", err);
        return null;
    }
}

const getPersonHeaders = async (personIdList) => {
    // TODO
    const mockPersonHeadersDb = [
        {
            id: 101,
            name: "Christian Bale",
            roles: ["Actor"],
            imageLink: "https://m.media-amazon.com/images/M/MV5BMTkxMzk4MjQ4MF5BMl5BanBnXkFtZTcwMzExODQxOA@@._V1_QL75_UX190_CR0,0,190,281_.jpg",
            description: "Christian Charles Philip Bale is an English actor. Known for his versatility and physical transformations for his roles, he has been a leading man in films of several genres."
        },
        {
            id: 102,
            name: "Heath Ledger",
            roles: ["Actor"],
            imageLink: "https://m.media-amazon.com/images/M/MV5BMTI2NTY0NzA4MF5BMl5BanBnXkFtZTYwMjE1MDE0._V1_QL75_UX190_CR0,0,190,281_.jpg",
            description: "Heath Andrew Ledger was an Australian actor and music video director. After performing roles in several Australian television and film productions during the 1990s, Ledger moved to the United States in 1998 to further develop his film career."
        },
        {
            id: 201,
            name: "Marlon Brando",
            roles: ["Actor", "Director", "Producer"],
            imageLink: "https://m.media-amazon.com/images/M/MV5BMTg3MDYyMDE5OF5BMl5BanBnXkFtZTcwNjgyNTEzNA@@._V1_QL75_UY207_CR64,0,140,207_.jpg",
            description: "Marlon Brando Jr. was an American actor and film director. He is credited with bringing realism to film acting."
        }
    ]
    try {
        const matches = mockPersonHeadersDb.filter(person =>
            personIdList.includes(person.id)
        );
        return matches;
    } catch (err) {
        console.error("Error retrieving person headers:", err);
        return null;
    }
}

const toggleFavorite = async (itemId) => {
    // TODO
    console.log("Toggling favorite for item: " + itemId)
}

const getItemReviews = async (itemId, page = 1, limit = 10) => {
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

const getTrendingMovies = async () => {
    // TODO
    const mockTrendingMoviesDb = [
        { itemId: 1, title: "The Dark Knight", rating: 9.0, imageLink: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_QL75_UX380_CR0,0,380,562_.jpg", year: 2008 },
        { itemId: 6, title: "Schindler's List", rating: 8.9, imageLink: "https://m.media-amazon.com/images/M/MV5BMTg3MDc4ODgyOF5BMl5BanBnXkFtZTgwNzY1ODIyNjM@._V1_QL75_UX190_CR0,10,190,281_.jpg", year: 1993 },
        { itemId: 9, title: "Inception", rating: 8.8, imageLink: "https://m.media-amazon.com/images/M/MV5BMjExMjkwNTQ0Nl5BMl5BanBnXkFtZTcwNTY0OTk1Mw@@._V1_QL75_UX190_CR0,0,190,281_.jpg", year: 2010 },
        { itemId: 11, title: "American Psycho", rating: 7.6, imageLink: "https://m.media-amazon.com/images/M/MV5BNzBjM2I5ZjUtNmIzNy00OGNkLWIwZDMtOTAwYWUwMzA2YjdlXkEyXkFqcGc@._V1_QL75_UX190_CR0,0,190,281_.jpg", year: 2000 },
        { itemId: 12, title: "The Dark Knight Rises", rating: 8.4, imageLink: "https://m.media-amazon.com/images/M/MV5BMTMxMTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_QL75_UX190_CR0,0,190,281_.jpg", year: 2012 }
    ]
    return mockTrendingMoviesDb;
}

const getTrendingShows = async () => {
    // TODO
    const mockTrendingShowsDb = [
        { itemId: 8, title: "The Office", rating: 9.0, imageLink: "https://m.media-amazon.com/images/M/MV5BZjQwYzBlYzUtZjhhOS00ZDQ0LWE0NzAtYTk4MjgzZTNkZWEzXkEyXkFqcGc@._V1_QL75_UX190_CR0,2,190,281_.jpg", year: 2008 },
    ]
    return mockTrendingShowsDb;
}

const getFilteredItems = async ({personId = null, genreId = null, minRating = null, type = null, orderByRating = false, orderByPopularity = false}) => {
    // TODO
    return [
        { itemId: 8, title: "The Office", rating: 9.0, imageLink: "https://m.media-amazon.com/images/M/MV5BZjQwYzBlYzUtZjhhOS00ZDQ0LWE0NzAtYTk4MjgzZTNkZWEzXkEyXkFqcGc@._V1_QL75_UX190_CR0,2,190,281_.jpg", year: 2008 },
        { itemId: 8, title: "The Office", rating: 9.0, imageLink: "https://m.media-amazon.com/images/M/MV5BZjQwYzBlYzUtZjhhOS00ZDQ0LWE0NzAtYTk4MjgzZTNkZWEzXkEyXkFqcGc@._V1_QL75_UX190_CR0,2,190,281_.jpg", year: 2008 },
        { itemId: 8, title: "The Office", rating: 9.0, imageLink: "https://m.media-amazon.com/images/M/MV5BZjQwYzBlYzUtZjhhOS00ZDQ0LWE0NzAtYTk4MjgzZTNkZWEzXkEyXkFqcGc@._V1_QL75_UX190_CR0,2,190,281_.jpg", year: 2008 },
        { itemId: 8, title: "The Office", rating: 9.0, imageLink: "https://m.media-amazon.com/images/M/MV5BZjQwYzBlYzUtZjhhOS00ZDQ0LWE0NzAtYTk4MjgzZTNkZWEzXkEyXkFqcGc@._V1_QL75_UX190_CR0,2,190,281_.jpg", year: 2008 },
        { itemId: 8, title: "The Office", rating: 9.0, imageLink: "https://m.media-amazon.com/images/M/MV5BZjQwYzBlYzUtZjhhOS00ZDQ0LWE0NzAtYTk4MjgzZTNkZWEzXkEyXkFqcGc@._V1_QL75_UX190_CR0,2,190,281_.jpg", year: 2008 },
    ];
}

export { getLoggedIn, getItemDetails, getMatchingItems, submitRating, submitReview, getPersonDetails, getItemReviews, getPersonHeaders, logoutUser, getTrendingMovies, getTrendingShows, getFilteredItems, loginUser, toggleFavorite };