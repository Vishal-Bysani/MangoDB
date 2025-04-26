import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import Navbar from "../components/Navbar";
import "../css/Search.css";
import { getGenreList, getFilteredItems, getMatchingPersons, getLoggedIn } from "../api";
import ListItemOverview from "../components/ListItemOverview";
import SearchDropdown from "../components/SearchDropdown";
import SearchBar from "../components/SearchBar";
import { loggedInDataContext, currentLinkContext } from "../Context";

const Search = () => {
    const { query } = useParams();

    const [totalPages, setTotalPages] = useState(null);

    const [searchQuery, setSearchQuery] = useState(query);

    const [matchingItems, setMatchingItems] = useState([]);

    const [personId, setPersonId] = useState(null);
    const [personText, setPersonText] = useState("");
    const [personList, setPersonList] = useState([]);

    const [genreId, setGenreId] = useState(null);
    const [genreText, setGenreText] = useState("");
    const [genreList, setGenreList] = useState([]);
    const [genreListFiltered, setGenreListFiltered] = useState([]);

    const [year, setYear] = useState(null);
    const [yearText, setYearText] = useState("");

    const [minRating, setMinRating] = useState(null);
    const [minRatingText, setMinRatingText] = useState("");

    const [orderByRating, setOrderByRating] = useState(false);
    const [orderByPopularity, setOrderByPopularity] = useState(true);
    const [forMovie, setForMovie] = useState(true);
    const [forShow, setForShow] = useState(true);

    const {loggedInData, setLoggedInData} = useContext(loggedInDataContext);
    const {currentLink, setCurrentLink} = useContext(currentLinkContext);
    const [pageNo, setPageNo] = useState(1);

    
    const pageLimit = 10;

    useEffect(() => {
        getGenreList().then(setGenreList);
    }, []);

    useEffect(() => {
        setGenreListFiltered(genreList);
    }, [genreList]);

    const handleFilterSubmit = () => {
        getFilteredItems({searchText: searchQuery, genreId: genreId, personId: personId, year: year, minRating: minRating, orderByRating: orderByRating, orderByPopularity: orderByPopularity, forMovie: forMovie, forShow: forShow, pageNo: pageNo, pageLimit: pageLimit}).then(setMatchingItems);
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    useEffect(() => {
        if (pageNo > 1 && matchingItems.length === 0) {
            setTotalPages(Math.max(pageNo - 1, 1));
            if (pageNo > 1) setPageNo(Math.max(pageNo - 1, 1));
        }
    }, [matchingItems]);

    useEffect(() => {
        handleFilterSubmit();
    }, [pageNo]);


    useEffect(() => {
        getLoggedIn().then(response => {
            if (response.status === 200) {
                response.json().then(data => {
                    setLoggedInData(data);
                });
            }
        });
        setCurrentLink(`/search/${query}`);
    }, []);

    return (
        <div>
            <Navbar />
            <div className="search-page-header">
                <SearchBar handleSearch={(searchText) => {
                        setSearchQuery(searchText);
                        setPageNo(1);
                        setTotalPages(null);
                        handleFilterSubmit();
                    }}
                    setParentSearchText={setSearchQuery}
                    initialSearchText={searchQuery}
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
                                }
                                setMinRating(null);
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
                                    onChange={() => { if (forMovie) setForShow(true); setForMovie(!forMovie)}}
                                />
                                Movie
                            </label>
                        </div>
                        <div className="search-page-filters-checkbox">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={forShow}
                                    onChange={() => { if (forShow) setForMovie(true); setForShow(!forShow)}}
                                />
                                Show
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
                <button className="search-page-pagination-button" onClick={() => setPageNo(Math.min(pageNo + 1, totalPages ? totalPages : pageNo + 1))} disabled={pageNo === totalPages}>Next</button>
            </div>
        </div>
    )
}

export default Search;