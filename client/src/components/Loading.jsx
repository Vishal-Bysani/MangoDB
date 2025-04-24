import React from "react";
import Navbar from "../components/Navbar";
import "../css/NotFound.css";
import { Grid } from 'ldrs/react'
import 'ldrs/react/Grid.css'


const Loading = () => {
    return (
        <>
            <div style={{position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -60%)'}}>
                <Grid size={400} speed={1.5} bgOpacity={0.25} color="#00e6a3"/>
            </div>
        </>
    );
};

export default Loading;

