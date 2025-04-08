import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import "../css/SearchDropdown.css";

const SearchDropdown = ( {filterName, filterList, setFilterValue, filterValueText, setFilterValueText, onFilterValueTextChange, allowEnter = false} ) => {
    const [hideDropdown, setHideDropdown] = useState(false);
    const searchDropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target)) {
                setHideDropdown(true);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    return (
        <div className="search-dropdown-container" ref={searchDropdownRef}>
            <input 
                type="text"
                placeholder={filterName} 
                className="search-dropdown-input"
                value={filterValueText}
                onClick={() => {setHideDropdown(false); onFilterValueTextChange(filterValueText);}}
                onChange={ (e) => {
                    setHideDropdown(false);
                    onFilterValueTextChange(e.target.value);
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && allowEnter) {
                        setHideDropdown(true);
                        setFilterValue(e.target.value);
                    }
                }}
            />
            { !hideDropdown && filterList.length > 0 &&
                <div className="search-dropdown-list" style={{ zIndex: 1000 }}>
                    {filterList.map((item) => (
                        <div className="search-dropdown-item" key={item.id} onClick={() => {
                            setFilterValue(item.id);
                            setFilterValueText(item.name);
                            setHideDropdown(true);
                        }}>{item.name}</div>
                    ))}
                </div>
            }
        </div>
    )
}

export default SearchDropdown;