import React, { useState, useEffect, useRef } from "react";
import ItemOverview from "./ItemOverview";
import "../css/ListItemOverview.css";

const ListItemOverview = ( { title, itemOverviewList, loggedIn }) => {
    return (
        <div className="list-item-overview-container">
            { title && <h1 className="list-item-overview-container-title">{title}</h1> }
            {itemOverviewList && itemOverviewList.map((itemOverview) => (
                <ItemOverview key={itemOverview.id}
                    itemId={itemOverview.id}
                    title={itemOverview.title}
                    image={itemOverview.image}
                    year={itemOverview.year}
                    startYear={itemOverview.startYear}
                    endYear={itemOverview.endYear}
                    rating={itemOverview.rating}
                    userRating={itemOverview.userRating}
                    cast={itemOverview.cast}
                    crew={itemOverview.crew}
                    description={itemOverview.description}
                    loggedIn={loggedIn}
                />
            ))}
        </div>
    )
}

export default ListItemOverview;