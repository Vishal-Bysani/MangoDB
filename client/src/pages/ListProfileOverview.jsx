import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import { getLoggedIn } from "../api";
import Navbar from "../components/Navbar";
import ProfileOverview from "../components/ProfileOverview";
import "../css/ItemOverview.css";
import { loggedInDataContext, currentLinkContext } from "../Context";

const ListProfileOverview = ({ title }) => {
    const { username } = useParams();
    const location = useLocation();
    const {loggedInData, setLoggedInData} = useContext(loggedInDataContext);
    const {currentLink, setCurrentLink} = useContext(currentLinkContext);
    const [profileList, setProfileList] = useState([]);

    useEffect(() => {
        getLoggedIn().then(response => {
            response.json().then(data => {
                setLoggedInData(data);
            });
        });
        setProfileList(location.state.profileList);
        setCurrentLink(`/profile/${username}/${title}`);
    }, []);

    return (
        <>
            { loggedInData && (
                <Navbar />
            )}
            <div className="profile-overview-container">
                { title && <h1 className="list-profile-overview-container-title">{title}</h1> }
                {profileList && profileList.map((profileOverview) => (
                    <ProfileOverview key={profileOverview.personId}
                        name={profileOverview.name ? profileOverview.name : profileOverview.username}
                        image={profileOverview.image}
                    />
                ))}
            </div>
        </>
    )
}

export default ListProfileOverview;
