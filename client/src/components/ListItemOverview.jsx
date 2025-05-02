import React, { useState, useEffect, useRef } from "react";
import ItemOverview from "./ItemOverview";
import "../css/ListItemOverview.css";

const ListItemOverview = ( { title, itemOverviewList, ref = null, forBook = false }) => {
    return (
        <div className="list-item-overview-container" ref={ref}>
            { title && <h1 className="list-item-overview-container-title">{title}</h1> }
            {itemOverviewList && itemOverviewList.map((itemOverview) => (
                <ItemOverview key={itemOverview.forBook ? 2 * itemOverview.id : 2 * itemOverview.id + 1} 
                    itemId={itemOverview.id}
                    title={itemOverview.title}
                    image={itemOverview.image || itemOverview.poster_path}
                    year={itemOverview.year || (itemOverview.release_date && itemOverview.release_date.slice(0,4))}
                    startYear={itemOverview.startYear}
                    endYear={itemOverview.endYear}
                    rating={itemOverview.rating || itemOverview.vote_average}
                    userRating={itemOverview.userRating}
                    cast={itemOverview.cast}
                    crew={itemOverview.crew}
                    description={itemOverview.description}
                    forBook={itemOverview.forBook}
                    author={itemOverview.author}
                    isWatchOrReadList={itemOverview.isWatchList || itemOverview.isWantToReadList}
                    type={itemOverview.category || itemOverview.type}
                />
            ))}
        </div>
    )
}

export default ListItemOverview;