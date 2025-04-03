import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { getLoggedIn } from "../api";
import Navbar from "../components/NavBar";


const Tag = () => {
    const { tagId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const checkStatus = async () => {
            getLoggedIn().then(loggedIn => { 
                if (!loggedIn) navigate("/login"); 
            });
        };
        checkStatus();
    }, [navigate]);

    return (
        <>
            <Navbar />
            <div className="tag-page" style={{marginTop: '200px'}}>
                <h1>Genre/Tag {tagId}</h1>
            </div>
        </>
    );
}

export default Tag;
