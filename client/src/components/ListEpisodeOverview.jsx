import React, { useState, useEffect } from "react";
import EpisodeOverview from "./EpisodeOverview";
import "../css/ListEpisodeOverview.css";

const ListEpisodeOverview = ({ title, titleFontSize, episodes, seriesId, seasonId, loggedIn }) => {
  
  return (
    <div className="list-episode-overview-container">
      { title && <h2 className="list-episode-overview-container-title" style={{ fontSize: titleFontSize }}>{title}</h2> }
      
      {episodes.map((episode) => (
        <EpisodeOverview
          key={episode.id}
          seriesId={seriesId}
          seasonId={seasonId}
          episodeId={episode.id}
          name={episode.name}
          image={episode.still_path}
          air_date={episode.air_date}
          episode_number={episode.episode_number}
          runtime={episode.runtime}
          vote_average={episode.vote_average}
          userRating={episode.userRating || 0}
          overview={episode.overview}
          loggedIn={loggedIn}
        />
      ))}
    </div>
  );
};

export default ListEpisodeOverview;