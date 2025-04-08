import React, { useState, useEffect, useRef } from "react";
import ItemOverview from "./ItemOverview";
import "../css/ListItemOverview.css";

const ListItemOverview = ( { title, itemOverviewList }) => {
    return (
        <div className="list-item-overview-container">
            <h1>{title}</h1>
            {itemOverviewList.map((itemOverview) => (
                <ItemOverview key={itemOverview.id}
                    itemId={itemOverview.id}
                    title={itemOverview.title}
                    image={itemOverview.image}
                    year={itemOverview.year}
                    rating={itemOverview.rating}
                    userRating={itemOverview.userRating}
                    cast={itemOverview.cast}
                    crew={itemOverview.crew}
                    description={itemOverview.description}
                />
            ))}
        </div>
    )
}

export default ListItemOverview;