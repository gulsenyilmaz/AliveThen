import React, { useState, useEffect} from 'react';

import './FilterList.css';
import Combobox from "react-widgets/Combobox";
import "react-widgets/styles.css";
import NavBar from './NavBar';


function FilterList({ 
    selectedOccupation, 
    occupations, 
    setSelectedOccupation, 
    
    selectedGender, 
    genders, 
    setSelectedGender,
    
    selectedNationality, 
    nationalities, 
    setSelectedNationality,

    selectedMovement, 
    movements, 
    setSelectedMovement,

    searchTerm,
    setSearchTerm,
    searchResults,
    setSearchResults,

    setSelectedPerson,
    setSelectedLocation
     }) {

    const [selectedItem, setSelectedItem] = useState(null);
    const [activeCategory, setActiveCategory] = useState("");
    const [listSearchInput, setListSearchInput] = useState("");
    const [listData, setListData] = useState([]);     

    useEffect(() => {

        switch (activeCategory) {
            case "occupations":
                setListData(occupations);
                break;
            case "genders":
                setListData(genders);
                break;
            case "nationalities":
                setListData(nationalities);
                break;
            case "movements":
                setListData(movements);
                break;
            default:
                break;
        }
        
    }, [activeCategory]);

    useEffect(() => {
        
        if (activeCategory){
            
            setSearchResults([]);
            if (selectedItem) {
                
                switch (activeCategory) {
                    case "occupations":
                        setSelectedOccupation(selectedItem);
                        break;
                    case "genders":
                        setSelectedGender(selectedItem);
                        break;
                    case "nationalities":
                        setSelectedNationality(selectedItem);
                        break;
                    case "movements":
                        setSelectedMovement(selectedItem);
                        break;
                    default:
                        break;
                }
                setListData([]);
                setActiveCategory("");
                setListSearchInput("");
                setSearchTerm("");
            }    
        }
    }, [selectedItem]);


  return (
    <>
    <div className="filter_list_panel_container">
        <NavBar
            activeCategory={activeCategory}
            onCategorySelect={(cat) =>{
                    setActiveCategory(cat);
                    setSelectedItem(null);
            } }
        />
      <div className="filter_list_panel">
        {/* 🔍 SEARCH BAR */}
        {activeCategory=="searchbar" && (
            <input
                type="text"
                className="search-bar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search people or places..."
                style={{ marginBottom: "0.5rem" }}
                />
        )}
        {activeCategory && activeCategory !== "searchbar" && (
            <input
                type="text"
                placeholder={`Search ${activeCategory}...`}
                value={listSearchInput}
                onChange={(e) => setListSearchInput(e.target.value)}
                className="search-bar"
                style={{ marginBottom: "0.5rem" }}
                />
        )}
        {listData && listData.length>0 && (
            <div className="category-list">
                <ul>
                    {listData
                    .filter((item) =>
                        item.name.toLowerCase().includes(listSearchInput.toLowerCase())
                    )
                    .map((item) => (
                        <li
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className={selectedItem?.id === item.id ? "selected" : ""}
                        >
                        {item.name} ({item.count})
                        </li>
                    ))}
                </ul>
            </div>
        )}
        {/* SEARCH RESULTS */}
        {searchResults && (
            <div className="search-results">
                {searchResults.humans?.length > 0 && (
                    <>
                    <h4>People</h4>
                    <ul>
                        {searchResults.humans.map((result) => (
                       <li key={`human-${result.id}`} onClick={() => setSelectedPerson(result)}>
                            👤 <strong>{result.name}</strong>
                        </li>
                        ))}
                    </ul>
                    </>
                )}

                {searchResults.locations?.length > 0 && (
                    <>
                    <h4>Places</h4>
                    <ul>
                        {searchResults.locations.map((result) => (
                        <li key={`location-${result.id}`} onClick={() => setSelectedLocation(result)}>
                            📍 <strong>{result.name}</strong>
                        </li>
                        ))}
                    </ul>
                    </>
                )}
                </div>
        )}
        {/* END OF SEARCH RESULTS */}
        </div> 
      </div>
    </>
  );
}

export default FilterList;