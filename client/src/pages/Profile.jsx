import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { getUserDetails, getLoggedIn, followUser } from "../api";
import Navbar from "../components/Navbar";
import "../css/Profile.css";
import moment from "moment";
import ListItemThumbnail from "../components/ListItemThumbnail";

const Profile = () => {
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [loggedInData, setLoggedInData] = useState(null);
    const favouriteRef = useRef(null);
    const watchlistRef = useRef(null);

    useEffect(() => {
        const fetchUser = async () => {
            const user = await getUserDetails(username);
            setUser(user);
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const fetchLoggedInData = async () => {
            getLoggedIn().then(response => {
                response.json().then(data => {
                    setLoggedInData(data);
                });
            });
        };
        fetchLoggedInData();
    }, []);

    return (
        <>
            { loggedInData && (
                <Navbar isLoggedIn={loggedInData.loggedIn} username={loggedInData.username} />
            )}
            { user && (
                <div className="profile-container">
                    <div className="profile-stats-container">
                        <div className="profile-image-container">
                            <img
                                src={user.image ? user.image : "/person-backdrop.svg"}
                                alt="Profile"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/person-backdrop.svg";
                                }}
                                className="profile-image"
                            />
                        </div>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "50px" }}>
                                <p style={{ fontSize: "50px", fontWeight: "bold", marginBottom: "10px" }}>{username}</p>
                                {loggedInData && loggedInData.username !== username && (
                                    <button 
                                        style={{
                                            padding: "10px 20px",
                                            fontSize: "18px",
                                            backgroundColor: "#10e3a5",
                                            color: "black",
                                            border: "none",
                                            borderRadius: "8px",
                                            cursor: "pointer",
                                            fontWeight: "bold",
                                            height: "fit-content",
                                            marginTop: "40px"
                                        }}
                                        onClick={() => {
                                            if (loggedInData.loggedIn) {
                                                followUser(username);
                                            } else {
                                                navigate("/login", { state: { parentLink : `/profile/${username}` }});
                                            }
                                        }}
                                    >
                                        Follow
                                    </button>
                                )}
                            </div>
                            { user.joinDate && <p style={{ fontSize: "20px", marginTop: "0px" }}> Joined {moment(user.joinDate).format("MMM YYYY")} </p> }
                        </div>
                        
                        <div className="profile-stats-grid">
                            <div className="profile-stat-card" onClick={() => {
                                if (favouriteRef.current) {
                                    const elementPosition = favouriteRef.current.getBoundingClientRect().top;
                                    const offsetPosition = elementPosition + window.scrollY - 120;
                                    
                                    window.scrollTo({
                                        top: offsetPosition,
                                        behavior: 'smooth'
                                    });
                                }
                            }}>
                                <div className="stat-label">Favourites</div>
                                <div className="stat-value">{user.favouriteMovies ? user.favouriteMovies.length : 0}</div>
                            </div>
                            <div className="profile-stat-card" onClick={() => {
                                if (watchlistRef.current) {
                                    const elementPosition = watchlistRef.current.getBoundingClientRect().top;
                                    const offsetPosition = elementPosition + window.scrollY - 120;
                                    
                                    window.scrollTo({
                                        top: offsetPosition,
                                        behavior: 'smooth'
                                    });
                                }
                            }}>
                                <div className="stat-label">Watchlist</div>
                                <div className="stat-value">{user.watchlist ? user.watchlist.length : 0}</div>
                            </div>
                            <div className="profile-stat-card" onClick={() => navigate(`/profile/${username}/followers`, {state: {profileList: user.followers}})}>
                                <div className="stat-label">Followers</div>
                                <div className="stat-value">{user.followers ? user.followers.length : 0}</div>
                            </div>
                            <div className="profile-stat-card" onClick={() => navigate(`/profile/${username}/following`, {state: {profileList: user.following}})}>
                                <div className="stat-label">Following</div>
                                <div className="stat-value">{user.following ? user.following.length : 0}</div>
                            </div>
                        </div>
                    </div>
                    <div className="profile-items-container">
                        { user.favouriteMovies && user.favouriteMovies.length > 0 && <ListItemThumbnail title="Favourites" itemThumbnails={user.favouriteMovies} titleFontSize="36px" loggedIn={loggedInData.loggedIn} ref={favouriteRef}/> }
                        { user.watchlist && user.watchlist.length > 0 && <ListItemThumbnail title="Watchlist" itemThumbnails={user.watchlist} titleFontSize="36px" loggedIn={loggedInData.loggedIn} ref={watchlistRef}/> }
                        { user.watchedList && user.watchedList.length > 0 && <ListItemThumbnail title="Watched List" itemThumbnails={user.watchedList} titleFontSize="36px" loggedIn={loggedInData.loggedIn}/> }
                    </div>
                </div>
            )}
        </>
    );
}

export default Profile;
