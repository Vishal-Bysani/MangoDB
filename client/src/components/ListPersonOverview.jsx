import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import { getLoggedIn } from "../api";
import Navbar from "../components/Navbar";
import PersonOverview from "./ProfileOverview";
import "../css/ItemOverview.css";

const ListPersonOverview = ({ title, ref }) => {
    const location = useLocation();
    const {loggedInData, setLoggedInData} = useContext(loggedInDataContext);
    const {currentLink, setCurrentLink} = useContext(currentLinkContext);
    const [profileList, setProfileList] = useState([]);

    useEffect(() => {
        getLoggedIn().then(setLoggedInData);
        setProfileList(location.state.profileList);
    }, []);

    return (
        <>
            { loggedInData && (
                <Navbar />
            )}
            <div className="item-overview-container" ref={ref}>
                { title && <h1 className="list-item-overview-container-title">{title}</h1> }
                {profileList && profileList.map((personOverview) => (
                    <PersonOverview key={personOverview.personId}
                        name={personOverview.name ? personOverview.name : personOverview.username}
                        image={personOverview.image}
                    />
                ))}
            </div>
        </>
    )
}

export default ListPersonOverview;
