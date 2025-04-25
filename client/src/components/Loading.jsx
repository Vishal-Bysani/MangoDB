import React from "react";
import Navbar from "../components/Navbar";
import "../css/NotFound.css";
import { Hatch } from 'ldrs/react'
import 'ldrs/react/Hatch.css'


const Loading = () => {
    return (
        <>
            <div style={{position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -60%)'}}>
                <Hatch size={100} speed={3} bgOpacity={0.25} stroke={10} color="#00e6a3"/>
            </div>
        </>
    );
};

export default Loading;