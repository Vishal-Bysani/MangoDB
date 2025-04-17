import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import { getLoggedIn, getSeasonDetails } from "../api";
import moment from "moment";
import Navbar from "../components/NavBar";
import "../css/ItemSeasons.css";
import ListEpisodeOverview from "../components/ListEpisodeOverview";


const ItemSeasons = () => {
    const { itemId } = useParams();
    const [loggedInData, setLoggedInData] = useState({loggedIn: false, userName: ""});
    const location = useLocation();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [seasons, setSeasons] = useState([]);
    const [seasonIndex, setSeasonIndex] = useState(null);
    const [episodes, setEpisodes] = useState([]);

    useEffect(() => {
        getLoggedIn().then(response => {
            if (response.status === 200) {
                response.json().then(data => {
                    setLoggedInData(data);
                });
            }
        });
        if (location.state) {
            setTitle(location.state.title);
            setSeasons(location.state.seasons);
            setSeasonIndex(0);
        }
    }, []);

    useEffect(() => {
        if (seasons.length > seasonIndex) {
            getSeasonDetails(itemId, seasons[seasonIndex].id).then(response => {
                console.log(response.episodes);
                setEpisodes(response.episodes);
            });
        }
    }, [seasonIndex]);

    const SeasonNavigator = () => {
        const totalSeasons = seasons.length;
        
        const handleSeasonClick = (index) => {
            setSeasonIndex(index);
        };
      
        return (
            <div className="season-navigator-container">
                <div className="season-navigator">
                    {Array.from({ length: totalSeasons }, (_, i) => (
                        <button 
                            key={i}
                            className={`season-button ${i === seasonIndex ? 'active' : ''}`}
                            onClick={() => handleSeasonClick(i)}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <>
            <Navbar isLoggedIn={loggedInData.loggedIn} userName={loggedInData.userName} />
            <div className="item-seasons-page">
                <div className="item-seasons-page-container">
                    <h1 style={{fontSize: "50px", fontWeight: "bold", marginBottom: "40px"}}>{title}</h1>
                    <div className="item-seasons-content">
                        <div className="item-seasons-image-container">
                            { seasons.length > seasonIndex && seasons[seasonIndex].poster_path && <img src={seasons[seasonIndex].poster_path} alt={seasons[seasonIndex].name} /> }
                        </div>
                        <div className="item-season-details">
                            { seasons.length > seasonIndex && seasons[seasonIndex].name && <h2>{seasons[seasonIndex].name}</h2> }
                            { seasons.length > seasonIndex && seasons[seasonIndex].air_date && <p>Aired on {moment(seasons[seasonIndex].air_date).format("DD MMMM YYYY")}</p> }
                            { seasons.length > seasonIndex && seasons[seasonIndex].overview && <p>{seasons[seasonIndex].overview}</p> }
                            { seasons.length > seasonIndex && seasons[seasonIndex].vote_average && <div className="item-overview-rating-container">
                                <p style={{fontWeight: 'bold'}}><span className="item-overview-yellow-star">★</span> {parseFloat(seasons[seasonIndex].vote_average).toFixed(1)}/10</p>
                            </div> }
                        </div>

                    </div>
                    <SeasonNavigator />
                    { seasons.length > seasonIndex && episodes.length > 0 && <ListEpisodeOverview 
                            episodes={episodes}
                            seriesId={itemId}
                            seasonId={seasons[seasonIndex].id}
                            loggedIn={loggedInData.loggedIn}
                        />
                    }
                </div>
            </div>
        </>
    )
}

export default ItemSeasons;