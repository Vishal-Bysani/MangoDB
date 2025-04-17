import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import { getLoggedIn } from "../api";
import Navbar from "../components/NavBar";
import ProfileOverview from "../components/ProfileOverview";
import "../css/ItemOverview.css";

const ListProfileOverview = ({ title }) => {
    const location = useLocation();
    const [loggedInData, setLoggedInData] = useState({loggedIn: false, userName: ""});
    const [profileList, setProfileList] = useState([]);

    useEffect(() => {
        getLoggedIn().then(response => {
            response.json().then(data => {
                setLoggedInData(data);
            });
        });
        setProfileList(location.state.profileList);
    }, []);

    return (
        <>
            { loggedInData && (
                <Navbar isLoggedIn={loggedInData.loggedIn} userName={loggedInData.username} />
            )}
            <div className="item-overview-container">
                { title && <h1 className="list-item-overview-container-title">{title}</h1> }
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
