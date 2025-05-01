import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getLoggedIn, getPersonDetails } from "../api";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import "../css/Person.css";
import ListItemThumbnail from "../components/ListItemThumbnail";
import moment from "moment";
import { loggedInDataContext, currentLinkContext } from "../Context";

const Person = () => {
    const { personId } = useParams();
    const navigate = useNavigate();
    const [person, setPerson] = useState(null);
    const [loading, setLoading] = useState(true);
    const {loggedInData, setLoggedInData} = useContext(loggedInDataContext);
    const {currentLink, setCurrentLink} = useContext(currentLinkContext);

    useEffect(() => {
        getLoggedIn().then(response => {
            if (response.status === 200) {
                response.json().then(data => {
                    setLoggedInData(data);
                });
            }
        });
        setCurrentLink(`/person/${personId}`);
    }, []);

    useEffect(() => {
        const fetchPersonDetails = async () => {
            setLoading(true);
            const data = await getPersonDetails(personId);
            setPerson(data);
            if (data && data.name) document.title = `${data.name}`;
            setLoading(false);
        };
        fetchPersonDetails();
    }, [personId]);

    if (loading) {
        return (
            <>
                <Navbar />
                <Loading/>
            </>
        )
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
                                <p style={{fontSize: '15px', fontWeight: 'bold'}} >POPULARITY</p>
                                <div className="popularity-score">
                                    <span className="arrow">🔥</span>
                                    <span style={{marginTop: '5px', fontWeight: 'bold'}}>{parseFloat(person.popularity).toFixed(1)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="person-content">
                    <div className="person-main">
                        <div style={{display: 'flex', gap: '50px', width: "100%"}}>
                            <img 
                                src={person.image ? person.image : "/person-backdrop.svg"} 
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
                                    { person.birthday && <span style={{display: 'flex'}}>
                                        <p style={{fontWeight: 'bolder'}}>Born:&nbsp;</p>
                                        <p> {moment(person.birthday).format('DD MMMM YYYY')} </p>
                                    </span> }
                                    {person.deathday && (
                                        <>  
                                            <p>·</p>
                                            <span style={{display: 'flex'}}>
                                                <p style={{fontWeight: 'bolder'}}>Death&nbsp;</p>
                                                <p> {moment(person.deathday).format('DD MMMM YYYY')} </p>
                                            </span>
                                        </>
                                    )}
                                </div>
                                <div style={{display: "flex", gap: '10px'}}>
                                    <span style={{display: 'flex'}}>
                                        <p style={{fontWeight: 'bolder'}}>Gender:&nbsp;</p>
                                        <p> {person.gender == 1 ? "Female" : person.gender == 2 ? "Male" : person.gender == 3 ? "Non-binary" : "-"} </p>
                                    </span>
                                </div>
                            </div>
                        </div>
                        { person.knownFor && person.knownFor.length > 0 && (
                            <ListItemThumbnail title="Known For" itemThumbnails={person.knownFor}/>
                        )}

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
