import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { getLoggedIn } from "../api";
import Navbar from "../components/NavBar";


const Person = () => {
    const { personId } = useParams();
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
            <div className="people-page" style={{marginTop: '200px'}}>
                <h1>Person {personId}</h1>
            </div>
        </>
    );
}

export default Person;
