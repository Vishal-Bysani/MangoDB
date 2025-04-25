import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import Navbar from "../components/Navbar";
import "../css/Collection.css";
import { getLoggedIn, getCollectionDetails } from "../api";
import ListItemOverview from "../components/ListItemOverview";

const Collection = () => {
    const { collectionId } = useParams();
    const [loggedInData, setLoggedInData] = useState({loggedIn: false, username: ""});
    const [collectionItems, setCollectionItems] = useState([]);
    const [collectionDetails, setCollectionDetails] = useState({});

    useEffect(() => {
        getLoggedIn().then(response => {
            if (response.status === 200) {
                response.json().then(data => {
                    setLoggedInData(data);
                });
            }
        });
    }, []);

    useEffect(() => {
        getCollectionDetails(collectionId).then(data => {
            setCollectionItems(data.moviesOrShow);
            setCollectionDetails(data.collection);
        });
    }, [collectionId])

    return (
        <div>
            <Navbar isLoggedIn={loggedInData.loggedIn} username={loggedInData.username} />
            <div className="collection-page-container">
                <p style={{fontSize: "50px", fontWeight: "bold"}}>{collectionDetails.name}</p>
                <div className="collection-page-content">
                    <img 
                        src={collectionDetails.image ? collectionDetails.image : "/item-backdrop.svg"}
                        alt={collectionDetails.title} 
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/item-backdrop.svg"; // Fallback image
                        }}
                    />
                    <p>{collectionDetails.description}</p>
                </div>
                <ListItemOverview itemOverviewList={collectionItems} loggedIn={loggedInData.loggedIn}/>
            </div>
        </div>
    )
}

export default Collection;