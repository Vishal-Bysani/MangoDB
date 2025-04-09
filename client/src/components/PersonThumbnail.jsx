import { useNavigate } from "react-router";
import "../css/PersonThumbnail.css";

const PersonThumbnail = ({ personId, name, image, character }) => {
    const navigate = useNavigate();
    
    return (
        <div key={personId} className="person-thumbnail" onClick={() => navigate(`/person/${personId}`)}>
            <div className="person-thumbnail-image-container">
                <img 
                    src={image ? image : "/person-backdrop.svg"} 
                    alt={name}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/person-backdrop.svg";
                    }}
                    />
            </div>
            <h3>{name}</h3>
            {character && <h4>{character}</h4>}
        </div>
    )
}

export default PersonThumbnail;