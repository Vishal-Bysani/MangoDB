import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar";

const Notfound = () => {
    return (
        <>
            <Navbar />
            <div className="not-found">
                <h1>404 - Page Not Found</h1>
            </div>
        </>
    )
}

export default Notfound;