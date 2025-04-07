import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getUserDetails, getLoggedIn } from "../api";
import Navbar from "../components/NavBar";
import "../css/Profile.css";
import moment from "moment";
import ListItemThumbnail from "../components/ListItemThumbnail";

const Profile = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [loggedInData, setLoggedInData] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const user = await getUserDetails();
            setUser(user);
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const fetchLoggedInData = async () => {
            getLoggedIn().then(response => {
                response.json().then(data => {
                    if (!data.loggedIn) navigate("/login");
                    setLoggedInData(data);
                });
            });
        };
        fetchLoggedInData();
    }, []);

    return (
        <>
            { loggedInData && (
                <Navbar isLoggedIn={loggedInData.isLoggedIn} userName={loggedInData.username} />
            )}
            { user && (
                <div className="profile-container">
                    <div className="profile-stats-container">
                        <div className="profile-image-container">
                            <img
                                src={user.image ? user.image : "/mangodb-logo.png"}
                                alt="Profile"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/mangodb-logo.png";
                                }}
                                className="profile-image"
                            />
                        </div>
                        <div>
                            <p style={{ fontSize: "50px", fontWeight: "bold", marginBottom: "10px" }}>{user.username}</p>
                            <p style={{ fontSize: "20px", marginTop: "0px" }}> Joined {moment(user.joinDate).format("MMM YYYY")} </p>
                        </div>
                        
                        <div className="profile-stats-grid">
                            <div className="profile-stat-card">
                                <div className="stat-label">Favorites</div>
                                <div className="stat-value">{user.favorites ? user.favorites.length : 0}</div>
                            </div>
                            <div className="profile-stat-card">
                                <div className="stat-label">Watchlist</div>
                                <div className="stat-value">{user.watchlist ? user.watchlist.length : 0}</div>
                            </div>
                            <div className="profile-stat-card">
                                <div className="stat-label">Reviews</div>
                                <div className="stat-value">{user.reviews ? user.reviews.length : 0}</div>
                            </div>
                            <div className="profile-stat-card">
                                <div className="stat-label">More</div>
-                            </div>
                        </div>
                    </div>
                    <div className="profile-items-container">
                        <ListItemThumbnail title="Favorites" itemThumbnails={user.favorites} fontSize="44px" />
                        <ListItemThumbnail title="Watchlist" itemThumbnails={user.watchlist} fontSize="44px" />
                    </div>
                </div>
            )}
        </>
    );
}

export default Profile;
