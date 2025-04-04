import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import { getLoggedIn, getPersonHeaders } from "../api";
import Navbar from "../components/NavBar";
import "../css/ListPersons.css";

const ListPersons = () => {
    const { itemId, role } = useParams();
    const navigate = useNavigate();
    const [persons, setPersons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("");
    const location = useLocation();

    useEffect(() => {
        const checkStatus = async () => {
            getLoggedIn().then(loggedIn => {
                if (!loggedIn) navigate("/login");
            });
        };
        checkStatus();
    }, [navigate]);

    useEffect(() => {
        const fetchPersons = async () => {
            const data = await getPersonHeaders(location.state.listId);
            setPersons(data);
            setLoading(false);
            setTitle(location.state.title);
        };
        fetchPersons();
    }, [location.state]);

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="loading" style={{marginTop: '120px'}}>Loading...</div>
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
                            <img src={person.imageLink} alt={person.name} />
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