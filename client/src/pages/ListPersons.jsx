import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import { getLoggedIn } from "../api";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import "../css/ListPersons.css";
import { loggedInDataContext, currentLinkContext } from "../Context";

const ListPersons = () => {
    const { itemId, role } = useParams();
    const navigate = useNavigate();
    const [persons, setPersons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("");
    const location = useLocation();
    const {loggedInData, setLoggedInData} = useContext(loggedInDataContext);
    const {currentLink, setCurrentLink} = useContext(currentLinkContext);
    
    useEffect(() => {
        getLoggedIn().then(setLoggedInData);
        setCurrentLink(`/items/${itemId}/list-persons/${role}/`);
    }, []);

    useEffect(() => {
        setPersons(location.state.personHeaders);
        setLoading(false);
        setTitle(location.state.title);
    }, [location.state]);

    if (loading) {
        return (
            <>
                <Navbar />
                <Loading/>
            </>
        )
    }

    if (!persons) {
        return (
            <>
                <Navbar />
                <div className="error" style={{marginTop: '120px'}}>No persons found</div>
            </>
        )
    }

    return (
        <>
            <Navbar />
            <div className="list-persons-page">
                <p className="list-persons-title" onClick={() => navigate(`/item/${itemId}`)} style={{cursor: 'pointer'}}>{role.charAt(0).toUpperCase() + role.slice(1)} | {title}</p>
                <div className="list-persons-container">
                    {persons.map(person => (
                        <div className="list-person-card" key={person.id}>
                            <img 
                                src={person.image ? person.image : "/person-backdrop.svg"} 
                                alt={person.name}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/mangodb-logo.png";
                                }}
                            />
                            <div className="list-person-card-info">
                                <p className="list-person-card-name" onClick={() => navigate(`/person/${person.id}`)} style={{cursor: 'pointer'}}>{person.name}</p>
                                <p className="list-person-card-description">{person.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
    
}

export default ListPersons;