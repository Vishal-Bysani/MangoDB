import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { getUserDetails, getLoggedIn, followUser, uploadProfileImage } from "../api";
import Navbar from "../components/Navbar";
import "../css/Profile.css";
import moment from "moment";
import ListItemThumbnail from "../components/ListItemThumbnail";
import { loggedInDataContext, currentLinkContext } from "../Context";
import { Buffer } from 'buffer';

const Profile = () => {
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const {loggedInData, setLoggedInData} = useContext(loggedInDataContext);
    const {currentLink, setCurrentLink} = useContext(currentLinkContext);
    const favouriteRef = useRef(null);
    const watchlistRef = useRef(null);
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    
    const isOwnProfile = loggedInData && username === loggedInData.username;

    useEffect(() => {
        const fetchUser = async () => {
            const user = await getUserDetails(username);
            if (user) {
                setUser(user);
                console.log(user);
                document.title = `${username} | Profile`;
            }
            if (user.profilePicture && user.mime_type) {
                const base64String = Buffer.from(user.profilePicture).toString('base64');
                user.image = `data:${user.mime_type};base64,${base64String}`;
            }
        };
        fetchUser();
    }, [username]);

    useEffect(() => {
        const fetchLoggedInData = async () => {
            getLoggedIn().then(setLoggedInData);
        };
        fetchLoggedInData();
        setCurrentLink(`/profile/${username}`);
    }, []);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                setUploading(true);
                const maxSize = 5 * 1024 * 1024; // 5MB
                if (file.size > maxSize) {
                    alert("File is too large. Maximum size is 5MB.");
                    setUploading(false);
                    return;
                }

                const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
                if (!validTypes.includes(file.type)) {
                    alert("Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.");
                    setUploading(false);
                    return;
                }
                const result = await uploadProfileImage(file, username);
                
                setUser(prevUser => ({
                    ...prevUser,
                    image: URL.createObjectURL(file)
                }));
                
                setUploading(false);
            } catch (error) {
                console.error("Error uploading image:", error);
                alert("Failed to upload image. Please try again.");
                setUploading(false);
            }
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    return (
        <>
            { loggedInData && (
                <Navbar />
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
                            {isOwnProfile && (
                                <>
                                    <div 
                                        className={`camera-button ${uploading ? 'uploading' : ''}`} 
                                        onClick={uploading ? null : triggerFileInput}
                                    >
                                        {uploading ? (
                                            <div className="spinner"></div>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="camera-icon">
                                                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                                                <circle cx="12" cy="13" r="4"></circle>
                                            </svg>
                                        )}
                                    </div>
                                    <input 
                                        type="file" 
                                        ref={fileInputRef}
                                        accept="image/jpeg,image/png,image/gif,image/webp"
                                        style={{ display: 'none' }}
                                        onChange={handleImageUpload}
                                    />
                                </>
                            )}
                        </div>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "50px" }}>
                                <p style={{ fontSize: "50px", fontWeight: "bold", marginBottom: "10px" }}>{username}</p>
                                {loggedInData && loggedInData.username !== username && (
                                    <button 
                                        className="follow-button"
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
                            { user.lastSeen === "Online" ? (
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "20px" }}>
                                    <div style={{ 
                                        width: "12px", 
                                        height: "12px", 
                                        backgroundColor: "#2ecc71",
                                        borderRadius: "50%",
                                        boxShadow: "0 0 8px rgba(46, 204, 113, 0.5)"
                                    }}></div>
                                    <span>Online</span>
                                </div>
                            ) : (
                                <p style={{ fontSize: "20px" }}>Last Seen: {user.lastSeen}</p>
                            )}
                        </div>
                        
                        <div className="profile-stats-grid">
                            <div className="profile-stat-card" onClick={() => {
                                if (favouriteRef.current && (user.favouriteMovies.length + user.favouriteBooks.length) > 0) {
                                    const elementPosition = favouriteRef.current.getBoundingClientRect().top;
                                    const offsetPosition = elementPosition + window.scrollY - 120;
                                    
                                    window.scrollTo({
                                        top: offsetPosition,
                                        behavior: 'smooth'
                                    });
                                }
                            }}>
                                <div className="stat-label">Favourites</div>
                                <div className="stat-value">{user.favouriteMovies ? user.favouriteMovies.length + user.favouriteBooks.length : 0}</div>
                            </div>
                            <div className="profile-stat-card" onClick={() => {
                                if (watchlistRef.current && (user.watchlist.length + user.wantToReadList.length) > 0) {
                                    const elementPosition = watchlistRef.current.getBoundingClientRect().top;
                                    const offsetPosition = elementPosition + window.scrollY - 120;
                                    
                                    window.scrollTo({
                                        top: offsetPosition,
                                        behavior: 'smooth'
                                    });
                                }
                            }}>
                                <div className="stat-label">Watchlist/Readlist</div>
                                <div className="stat-value">{user.watchlist ? user.watchlist.length + user.wantToReadList.length : 0}</div>
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
                        { user.favouriteMovies && user.favouriteMovies.length > 0 && <ListItemThumbnail title="Favourite Movies/Shows" itemThumbnails={user.favouriteMovies} titleFontSize="36px" ref={favouriteRef}/> }
                        { user.favouriteBooks && user.favouriteBooks.length > 0 && <ListItemThumbnail title="Favourite Books" itemThumbnails={user.favouriteBooks} titleFontSize="36px" forBook={true} ref={favouriteRef}/> }
                        { user.watchlist && user.watchlist.length > 0 && <ListItemThumbnail title="Watchlist" itemThumbnails={user.watchlist} titleFontSize="36px" ref={watchlistRef} isWatchOrReadList={true}/> }
                        { user.wantToReadList && user.wantToReadList.length > 0 && <ListItemThumbnail title="To-Read List" itemThumbnails={user.wantToReadList} titleFontSize="36px" forBook={true} ref={favouriteRef} isWatchOrReadList={true}/> }
                        { user.watchedList && user.watchedList.length > 0 && <ListItemThumbnail title="Watched List" itemThumbnails={user.watchedList} titleFontSize="36px"/> }
                        { user.readList && user.readList.length > 0 && <ListItemThumbnail title="Books Read" itemThumbnails={user.readList} titleFontSize="36px" forBook={true}/> }
                    </div>
                </div>
            )}
        </>
    );
}

export default Profile;