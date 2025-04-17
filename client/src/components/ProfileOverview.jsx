import React, { forwardRef } from "react";
import { useNavigate } from "react-router";
import "../css/ItemOverview.css";

const ProfileOverview = forwardRef(({ name, image }, ref) => {
    const navigate = useNavigate();
    
    return (
        <div className="item-overview-container" ref={ref}>
            <div className="item-overview-content">
                <div className="item-overview-image-container">
                    <img
                        src={image ? image : "/person-backdrop.svg"}
                        alt={name}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/person-backdrop.svg";
                        }}
                        className="item-overview-image"
                        onClick={() => navigate(`/profile/${name}`)}
                    />
                </div>
                <div className="item-overview-info-container">
                    <p onClick={() => navigate(`/profile/${name}`)} style={{ cursor: "pointer", fontSize: "36px", fontWeight: "bolder", color: "#10e3a5", marginBottom: "10px" }}>{name}</p> 
                </div>
            </div>
        </div>
    )
})

export default ProfileOverview;
