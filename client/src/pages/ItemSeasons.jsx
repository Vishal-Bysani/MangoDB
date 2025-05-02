import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import { getLoggedIn, getSeasonDetails } from "../api";
import moment, { max } from "moment";
import Navbar from "../components/Navbar";
import "../css/ItemSeasons.css";
import ListEpisodeOverview from "../components/ListEpisodeOverview";
import { loggedInDataContext, currentLinkContext } from "../Context";

const SeasonNavigator = ( { seasonIndex, setSeasonIndex, totalSeasons }) => {
    const [visibleIndex, setVisibleIndex] = useState(0);
    const [maxButtons, setMaxButtons] = useState(10);
    
    useEffect(() => {
        const calculateVisibleButtons = () => {
            setMaxButtons(Math.ceil(window.innerWidth / 90));
        };
        calculateVisibleButtons();
        window.addEventListener('resize', calculateVisibleButtons);
        return () => {
            window.removeEventListener('resize', calculateVisibleButtons);
        };
    }, []);
    
    return (
        <div className="season-navigator-container">
            <div className="season-navigator">
                <button className="season-nav-arrow" onClick={() => setVisibleIndex(Math.max(visibleIndex - maxButtons, 0))} disabled={visibleIndex === 0}> &lt; </button>
                {Array.from({ length: totalSeasons }, (_, i) => {
                    if (i >= visibleIndex && i < visibleIndex + maxButtons) {
                        return (
                            <button 
                                key={i}
                                className={`season-button ${i === seasonIndex ? 'active' : ''}`}
                                onClick={() => setSeasonIndex(i)}
                            > {i + 1} </button>
                        );
                    }
                    return null;
                })}
                <button className="season-nav-arrow" onClick={() => setVisibleIndex(visibleIndex + 2 * maxButtons < totalSeasons ? visibleIndex + maxButtons : totalSeasons - maxButtons)} disabled={visibleIndex >= totalSeasons}> &gt; </button>
            </div>
        </div>
    );
};

const ItemSeasons = () => {
    const { itemId } = useParams();
    const {loggedInData, setLoggedInData} = useContext(loggedInDataContext);
    const {currentLink, setCurrentLink} = useContext(currentLinkContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [seasons, setSeasons] = useState([]);
    const [seasonIndex, setSeasonIndex] = useState(null);
    const [episodes, setEpisodes] = useState([]);
    const [seasonVideos, setSeasonVideos] = useState([]);

    useEffect(() => {
        getLoggedIn().then(setLoggedInData);
        setCurrentLink(`/item/${itemId}/seasons`);
        if (location.state) {
            setTitle(location.state.title);
            setSeasons(location.state.seasons);
            setSeasonIndex(0);
        }
    }, []);

    useEffect(() => {
        if (seasons.length > seasonIndex) {
            getSeasonDetails(itemId, seasons[seasonIndex].id).then(response => {
                setEpisodes(response.episodes);
                setSeasonVideos(response.season_videos);
                console.log(response);
            });
        }
    }, [seasonIndex]);

    return (
        <>
            <Navbar />
            <div className="item-seasons-page">
                <div className="item-seasons-page-container">
                    <h1 style={{fontSize: "50px", fontWeight: "bold", marginLeft: "10%", display: "flex"}}>
                        <p style={{cursor: "pointer"}} onClick={() => navigate(`/item/${itemId}`)}>{title}&nbsp;</p>
                        <p>{ seasons.length > seasonIndex && seasons[seasonIndex].name && "| " + seasons[seasonIndex].name }</p>
                    </h1>
                    <div className="item-seasons-content">
                        <div className="item-seasons-image-container">
                            { seasons.length > seasonIndex && seasons[seasonIndex].poster_path && <img src={seasons[seasonIndex].poster_path} alt={seasons[seasonIndex].name} /> }
                        </div>
                        <div className="season-trailer">
                            <iframe 
                                width="100%" 
                                height="100%" 
                                src={seasonVideos && seasonVideos.find(v => v.type === "Trailer") ? seasonVideos.find(v => v.type === "Trailer").video_path.replace('watch?v=', 'embed/') : (seasonVideos && seasonVideos.length > 0 ? seasonVideos[0].video_path.replace('watch?v=', 'embed/') : "https://www.youtube.com/embed/dQw4w9WgXcQ")} 
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                    <div className="item-season-details">
                        { seasons.length > seasonIndex && seasons[seasonIndex].air_date && <p>Aired on {moment(seasons[seasonIndex].air_date).format("DD MMMM YYYY")}</p> }
                        { seasons.length > seasonIndex && seasons[seasonIndex].overview && <p>{seasons[seasonIndex].overview}</p> }
                        { seasons.length > seasonIndex && seasons[seasonIndex].vote_average && <div className="item-overview-rating-container">
                            <p style={{fontWeight: 'bold'}}><span className="item-overview-yellow-star">★</span> {parseFloat(seasons[seasonIndex].vote_average).toFixed(1)}/10</p>
                        </div> }
                    </div>
                    <SeasonNavigator seasonIndex={seasonIndex} setSeasonIndex={setSeasonIndex} totalSeasons={seasons.length}/>
                    { seasons.length > seasonIndex && episodes.length > 0 && <ListEpisodeOverview 
                            episodes={episodes}
                            seriesId={itemId}
                            seasonId={seasons[seasonIndex].id}
                           
                        />
                    }
                </div>
            </div>
        </>
    )
}

export default ItemSeasons;