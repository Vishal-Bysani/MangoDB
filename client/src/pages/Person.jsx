import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getLoggedIn, getPersonDetails } from "../api";
import Navbar from "../components/NavBar";
import "../css/Person.css";

const Person = () => {
    const { personId } = useParams();
    const navigate = useNavigate();
    const [person, setPerson] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkStatus = async () => {
            getLoggedIn().then(loggedIn => { 
                if (!loggedIn) navigate("/login"); 
            });
        };
        checkStatus();
    }, [navigate]);

    useEffect(() => {
        const fetchPersonDetails = async () => {
            setLoading(true);
            const data = await getPersonDetails(personId);
            setPerson(data);
            setLoading(false);
        };
        fetchPersonDetails();
    }, [personId]);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!person) {
        return <div className="error">Person not found</div>;
    }

    return (
        <>
            <Navbar />
            <div className="people-page">
                <div className="person-header-container">
                    <div className="person-header">
                        <h1 className="person-title">{person.name}</h1>
                        <div className="person-metadata">
                            <span>{person.roles.join(" · ")}</span>
                        </div>
                    </div>
                    <div className="person-sidebar">
                        <div className="rating-section">
                            <div className="popularity">
                                <h4 style={{fontSize: '15px', fontWeight: 'bold'}} >POPULARITY</h4>
                                <div className="popularity-score">
                                    <span className="arrow">-</span>
                                    <span>{person.popularity}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="person-content">
                    <div className="person-main">
                        <div style={{display: 'flex', gap: '30px'}}>
                            <img 
                                src={person.imageLink} 
                                alt={person.name} 
                                className="person-image"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/mangodb-logo.png";
                                }}
                            />
                            <div className="person-description">
                                <p>{person.description}</p>
                                <div style={{display: "flex", gap: '10px'}}>
                                    <span style={{display: 'flex'}}>
                                        <p style={{fontWeight: 'bolder'}}>Born:&nbsp;</p>
                                        <p> {person.dateOfBirth} </p>
                                    </span>
                                    {person.dateOfDeath && (
                                        <>  
                                            <p>·</p>
                                            <span style={{display: 'flex'}}>
                                                <p style={{fontWeight: 'bolder'}}>Death&nbsp;</p>
                                                <p> {person.dateOfDeath} </p>
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="known-for-container">
                            <h2 className="known-for-title">Known For</h2>
                            <div className="known-for-grid">
                                {person.knownFor.map((item) => (
                                    <div 
                                        key={item.itemId} 
                                        className="known-for-item"
                                        onClick={() => navigate(`/item/${item.itemId}`)}
                                    >
                                        <img 
                                            src={item.imageLink} 
                                            alt={item.title}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "/mangodb-logo.png";
                                            }}
                                        />
                                        <h4>{item.title}</h4>
                                        <p>{item.year}</p>
                                        <p>Rating: {item.rating}/10</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {person.awards && person.awards.length > 0 && (
                            <div className="awards-container">
                                <h2 className="awards-title">Awards</h2>
                                {person.awards.map((award) => (
                                    <div key={award.awardId} className="award-item">
                                        <h4>{award.organizationName}</h4>
                                        <p>{award.yearReceived}</p>
                                        <p>For: {award.item.title}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Person;
