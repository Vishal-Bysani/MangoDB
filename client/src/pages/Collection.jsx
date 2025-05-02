import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import Navbar from "../components/Navbar";
import "../css/Collection.css";
import { getLoggedIn, getCollectionDetails } from "../api";
import ListItemOverview from "../components/ListItemOverview";
import { loggedInDataContext, currentLinkContext } from "../Context";

const Collection = () => {
    const { collectionId } = useParams();
    const {loggedInData, setLoggedInData} = useContext(loggedInDataContext);
    const {currentLink, setCurrentLink} = useContext(currentLinkContext);
    const [collectionItems, setCollectionItems] = useState([]);
    const [collectionDetails, setCollectionDetails] = useState({});

    useEffect(() => {
        getLoggedIn().then(setLoggedInData);
        setCurrentLink(`/collection/${collectionId}`);
    }, []);

    useEffect(() => {
        getCollectionDetails(collectionId).then(data => {
            setCollectionItems(data.moviesOrShow);
            console.log(data.moviesOrShow);
            setCollectionDetails(data.collection);
        });
    }, [collectionId])

    return (
        <div>
            <Navbar />
            <div className="collection-page-container">
                <p style={{fontSize: "50px", fontWeight: "bold"}}>{collectionDetails.name}</p>
                <div className="collection-page-content">
                    <img 
                        src={collectionDetails.image ? collectionDetails.image : "/item-backdrop.svg"}
                        alt={collectionDetails.title}
                        style={{width:"20%", height:"auto"}}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/item-backdrop.svg"; // Fallback image
                        }}
                    />
                    <p>{collectionDetails.description}</p>
                </div>
                <ListItemOverview itemOverviewList={collectionItems}/>
            </div>
        </div>
    )
}

export default Collection;