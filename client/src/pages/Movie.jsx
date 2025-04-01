import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router";

const Movie = () => {
    const { movieId } = useParams();
    return <span>MovieId {movieId}</span>
}

export default Movie;
