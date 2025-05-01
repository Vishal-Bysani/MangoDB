import React, { useEffect, useState, useRef } from "react";
import "../css/SearchDropdown.css";

const SearchDropdown = ({ filterName, filterList, setFilterValue, filterValue, filterValueText, setFilterValueText, onFilterValueTextChange, allowEnter = false }) => {
    const [hideDropdown, setHideDropdown] = useState(true);
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
            <div className="search-input-wrapper">
                <input 
                    type="text"
                    placeholder={filterName} 
                    className="search-dropdown-input"
                    value={filterValueText || ""}
                    onClick={ () => {setHideDropdown(false);} }
                    onChange={(e) => {
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
                { filterValue && (
                    <div className="search-tick-icon" style={{cursor: "pointer"}} onClick={() => {
                            setHideDropdown(false);
                            onFilterValueTextChange("");
                        }}>
                        <svg 
                            width="16" 
                            height="16" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                        >
                        <path 
                            d="M6 6L18 18" 
                            stroke="#ff4444" 
                            strokeWidth="3" 
                            strokeLinecap="round" 
                        />
                        <path 
                            d="M6 18L18 6" 
                            stroke="#ff4444" 
                            strokeWidth="3" 
                            strokeLinecap="round" 
                        />
                        </svg>
                    </div>
                  
                )}
                { !filterValue && !hideDropdown && filterValueText !== "" && (
                    <div className="search-tick-icon">
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                        <path
                            d="M12 3v12"
                            stroke="#ff4444"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <circle
                            cx="12"
                            cy="19"
                            r="1.5"
                            fill="#ff4444"
                        />
                        </svg>
                    </div>
                  
                )}
            </div>
            {!hideDropdown && filterList.length > 0 &&
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