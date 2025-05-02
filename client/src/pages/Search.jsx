import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import Navbar from "../components/Navbar";
import "../css/Search.css";
import { getGenreList, getFilteredItems, getMatchingPersons, getLoggedIn } from "../api";
import ListItemOverview from "../components/ListItemOverview";
import SearchDropdown from "../components/SearchDropdown";
import SearchBar from "../components/SearchBar";
import { loggedInDataContext, currentLinkContext } from "../Context";

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Global context
    const { loggedInData, setLoggedInData } = useContext(loggedInDataContext);
    const { setCurrentLink } = useContext(currentLinkContext);

    // Read from URL
    const getFromParams = (key, fallback = null) =>
        searchParams.get(key) ?? fallback;

    const [searchQuery, setSearchQuery] = useState(getFromParams("q", ""));
    const intialSearchQuery = searchQuery;
    const [genreId, setGenreId] = useState(getFromParams("genre") || null);
    const [personId, setPersonId] = useState(getFromParams("person") || null);
    const [year, setYear] = useState(getFromParams("year") || null);
    const [minRating, setMinRating] = useState(
        parseFloat(getFromParams("minRating")) || null
    );
    const [orderByRating, setOrderByRating] = useState(
        getFromParams("order") === "rating"
    );
    const [orderByPopularity, setOrderByPopularity] = useState(
        getFromParams("order") !== "rating"
    );
    const [forMovie, setForMovie] = useState(searchParams.get("movie") !== "0");
    const [forShow, setForShow] = useState(searchParams.get("show") !== "0");
    const [forBook, setForBook] = useState(searchParams.get("book") !== "0");

    // Additional states
    const [genreList, setGenreList] = useState([]);
    const [genreText, setGenreText] = useState("");
    const [genreListFiltered, setGenreListFiltered] = useState([]);
    const [personText, setPersonText] = useState("");
    const [personList, setPersonList] = useState([]);
    const [yearText, setYearText] = useState(year || "");
    const [minRatingText, setMinRatingText] = useState(minRating?.toString() || "");
    const [matchingItems, setMatchingItems] = useState([]);
    const [pageNo, setPageNo] = useState(parseInt(getFromParams("page") || 1));
    const [totalPages, setTotalPages] = useState(null);

    const pageLimit = 10;

    const updateSearchParams = (overrides = {}) => {
        const newParams = {
            q: searchQuery || undefined,
            genre: genreId || undefined,
            person: personId || undefined,
            personName: personText,
            year: year || undefined,
            minRating: minRating || undefined,
            order: orderByRating ? "rating" : "popularity",
            movie: forMovie ? "1" : "0",
            show: forShow ? "1" : "0",
            book: forBook ? "1" : "0",
            page: pageNo || 1,
            ...overrides,
        };
        // Clean undefined/nulls
        Object.keys(newParams).forEach(
            (key) => (newParams[key] == null || newParams[key] === "") && delete newParams[key]
        );
        setSearchParams(newParams);
    };

    useEffect(() => {
        getGenreList().then((data) => {
            setGenreList(data);
            if (genreId) setGenreText(data.find(genre => genre.id == genreId).name);
        });
        setPersonText(getFromParams("personName"));
    }, []);

    useEffect(() => {
        if (genreId) setGenreListFiltered(genreList.filter(genre => genre.name.toLowerCase().includes(genreText.trim().toLowerCase())));
        else setGenreListFiltered(genreList);
    }, [genreList]);

    const handleFilterSubmit = () => {
        updateSearchParams(); // Sync filters to URL
        getFilteredItems({
            searchText: searchQuery,
            genreId,
            personId,
            year,
            minRating,
            orderByRating,
            orderByPopularity,
            forMovie,
            forShow,
            forBook,
            pageNo,
            pageLimit,
        }).then(data => {
            setMatchingItems(data);
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    useEffect(() => {
        if (pageNo > 0) handleFilterSubmit();
    }, [pageNo]);

    useEffect(() => {
        if (pageNo > 1 && matchingItems.length === 0) {
            setTotalPages(Math.max(pageNo - 1, 1));
            if (pageNo > 1) setPageNo(pageNo);
        } else if (pageNo > 0 && matchingItems.length > 0 && pageNo > totalPages) {
            setTotalPages(null);
        }
    }, [matchingItems]);

    useEffect(() => {
        getLoggedIn().then(setLoggedInData);
        setCurrentLink(`/search?q=${searchQuery}`);
        document.title = `Search: ${searchQuery}`;
    }, [])

    return (
        <div>
            <Navbar />
            <div className="search-page-header">
                <SearchBar handleSearch={(searchText) => {
                        setSearchQuery(searchText);
                        if (pageNo !== 1) setPageNo(1);
                        setTotalPages(null);
                        handleFilterSubmit();
                    }}
                    setParentSearchText={setSearchQuery}
                    initialSearchText={intialSearchQuery}
                />
            </div>
            <div className="search-page-container">
                <div className="search-page-filters-container">
                    <div className="search-page-filters-container-title">
                        <span>Filters</span>
                    </div>
                    <div className="search-page-filters-item-list">
                        <SearchDropdown 
                            filterName="Genre"
                            filterList={genreListFiltered}
                            filterValue={genreId}
                            setFilterValue={setGenreId}
                            filterValueText={genreText}
                            setFilterValueText={setGenreText}
                            onFilterValueTextChange={async (searchText) => {
                                if (searchText.length > 0) {
                                    setGenreListFiltered(genreList.filter(genre => genre.name.toLowerCase().includes(searchText.trim().toLowerCase())));
                                    setGenreText(searchText.trim());
                                } else {
                                    setGenreListFiltered(genreList);
                                    setGenreText("");
                                }
                                setGenreId(null);
                            }}
                        />
                        <SearchDropdown 
                            filterName="Person"
                            filterList={personList}
                            filterValue={personId}
                            setFilterValue={setPersonId}
                            filterValueText={personText}
                            setFilterValueText={setPersonText}
                            onFilterValueTextChange={async (searchText) => {
                                if (searchText.length > 0) {
                                    const filteredPersonList = personList.filter(person => person.name.toLowerCase().includes(searchText.trim().toLowerCase()))
                                    if (filteredPersonList.length < 20) {
                                        getMatchingPersons(searchText.trim(), 100).then(setPersonList);
                                    } else setPersonList(filteredPersonList);
                                    setPersonText(searchText);
                                } else {
                                    setPersonList([]);
                                    setPersonText("");
                                }
                                setPersonId(null);
                            }}
                        />
                        <SearchDropdown
                            filterName="Year"
                            filterList={[]}
                            filterValue={year}
                            setFilterValue={setYear}
                            filterValueText={yearText}
                            setFilterValueText={setYearText}
                            allowEnter={true}
                            onFilterValueTextChange={async (searchText) => {
                                if (searchText.length > 0 && parseInt(searchText) > 1900) {
                                    setYear(parseInt(searchText));
                                    setYearText(String(parseInt(searchText)));
                                } else if (searchText.length > 0) {
                                    setYearText(String(parseInt(searchText)));
                                } else {
                                    setYearText("");
                                    setYear(null);
                                }
                            }}
                        />
                        <SearchDropdown
                            filterName="Minimum Rating"
                            filterList={[]}
                            filterValue={minRating}
                            setFilterValue={setMinRating}
                            filterValueText={minRatingText}
                            setFilterValueText={setMinRatingText}
                            allowEnter={true}
                            onFilterValueTextChange={async (searchText) => {
                                if (searchText.length > 0 && searchText.match(/^\d*\.?\d*$/)) {
                                    setMinRating(Math.min(Math.max(parseFloat(searchText), 0.0), 10.0));
                                    if (searchText.endsWith(".")) setMinRatingText(String(Math.min(Math.max(parseFloat(searchText), 0.0), 10.0)) + '.');
                                    else setMinRatingText(String(Math.min(Math.max(parseFloat(searchText), 0.0), 10.0)));
                                } else {
                                    setMinRatingText("");
                                    setMinRating(null);
                                }
                            }}
                        />
                        <div className="search-page-filters-checkbox" style={{ marginTop: "15px" }}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={orderByRating}
                                    onChange={() => { setOrderByRating(!orderByRating); setOrderByPopularity(false);}}
                                />
                                Highest Rated
                            </label>
                        </div>
                        <div className="search-page-filters-checkbox">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={orderByPopularity}
                                    onChange={() => { setOrderByPopularity(!orderByPopularity); setOrderByRating(false);}}
                                />
                                Popular
                            </label>
                        </div>
                        <div className="search-page-filters-checkbox">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={forMovie}
                                    onChange={() => { if (forMovie && !forShow && !forBook) { setForShow(true); } setForMovie(!forMovie)}}
                                />
                                Movie
                            </label>
                        </div>
                        <div className="search-page-filters-checkbox">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={forShow}
                                    onChange={() => { if (forShow && !forMovie && !forBook) { setForMovie(true); } setForShow(!forShow)}}
                                />
                                Show
                            </label>
                        </div>
                        <div className="search-page-filters-checkbox">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={forBook}
                                    onChange={() => { if (forBook && !forMovie && !forShow) { setForShow(true); setForMovie(true); } setForBook(!forBook)}}
                                />
                                Book
                            </label>
                        </div>
                        <div className="search-page-submit-button">
                            <button onClick={() => {setPageNo(1); handleFilterSubmit()}}>Submit</button>
                        </div>
                    </div>
                </div>
                <div className="search-page-results-container">
                    <div className="search-page-results-container-title">
                        { matchingItems && matchingItems.length > 0 ? <ListItemOverview  itemOverviewList={matchingItems}/> : <div className="search-page-results-container-no-results">No results found</div>}
                    </div>
                </div>
            </div>
            <div className="search-page-pagination-container">
                    <button className="search-page-pagination-button" onClick={() => setPageNo(Math.max(pageNo - 1, 1))} disabled={pageNo === 1}>Previous</button>
                    <span className="search-page-pagination-info">{pageNo} { totalPages && `of ${totalPages}`}</span>
                <button className="search-page-pagination-button" onClick={() => setPageNo(Math.min(pageNo + 1, totalPages ? totalPages : pageNo + 1))} disabled={matchingItems.length === 0 || (totalPages && pageNo >= totalPages)}>Next</button>
            </div>
        </div>
    )
}

export default Search;