import React, { forwardRef, useState } from "react";
import { useNavigate } from "react-router";
import moment from "moment";
import "../css/EpisodeOverview.css";

const EpisodeOverview = forwardRef(({ 
  seriesId, 
  seasonId,
  episodeId, 
  name, 
  image, 
  air_date, 
  episode_number,
  runtime,
  vote_average,
  userRating, 
  overview,
  loggedIn 
}, ref) => {
  const navigate = useNavigate();
  
  return (
    <div className="episode-overview-container" ref={ref}>
      <div className="episode-overview-content">
        <div className="episode-overview-image-container">
          <img
            src={image ? image : "/item-backdrop.svg"}
            alt={name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/item-backdrop.svg";
            }}
            className="episode-overview-image"
          />
        </div>
        <div className="episode-overview-info-container">
          <p 
            style={{ cursor: "pointer", fontSize: "20px", fontWeight: "bolder", color: "#10e3a5", marginBottom: "10px" }}
          >
            {episode_number}. {name}
          </p>
          <div className="episode-overview-rating-container">
            <p style={{fontWeight: 'bold'}}><span className="episode-overview-yellow-star">★</span> {parseFloat(vote_average).toFixed(1)}/10</p>
            {userRating > 0 && <p style={{fontWeight: 'bold'}}><span className="episode-overview-blue-star">★</span> {parseFloat(userRating).toFixed(1)}/10</p>}
            <p>Aired on {moment(air_date).format("DD MMMM YYYY")}</p>
            {runtime && <p>Runtime: {runtime} min</p>}
            </div>
          <p style={{marginTop: "10px", fontSize: "14px", fontWeight: "normal"}}>{overview}</p>
        </div>
      </div>
    </div>
  );
});

export default EpisodeOverview;