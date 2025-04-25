import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import Navbar from "../components/Navbar";
import { getLoggedIn } from "../api";
import "../css/Book.css";

const Book = () => {
    const [loggedInData, setLoggedInData] = useState({loggedIn: false, username: ""});

    useEffect(() => {
        getLoggedIn().then(response => {
            if (response.status === 200) {
                response.json().then(data => {
                    setLoggedInData(data);
                });
            }
        });
    }, []);

    return (
        <>
            <Navbar isLoggedIn={loggedInData.loggedIn} username={loggedInData.username} />
        </>
    )
}

export default Book;