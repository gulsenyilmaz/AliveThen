import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import "./NavBar.css";

function NavBar({ onCategorySelect, activeCategory }) {
  const categories = ["Occupations", "Genders", "Nationalities", "Movements"];

  return (
    // <div className="nav-bar">
    //   {categories.map((cat) => (
    //     <button
    //       key={cat}
    //       className={`nav-button ${activeCategory === cat.toLowerCase() ? "active" : ""}`}
    //       onClick={() => onCategorySelect(cat.toLowerCase())}
    //     >
    //       {cat.toUpperCase()}
    //     </button>
    //   ))}

    //   <button className={`nav-button ${activeCategory === "searchbar" ? "active" : ""}`}
    //   onClick={() => onCategorySelect("searchbar")}><FaSearch /></button>
    // </div>

    <div className="nav-bar">
        <div className="nav-left">
            {categories.map((cat) => (
            <button
                key={cat}
                className={`nav-button ${activeCategory === cat.toLowerCase() ? "active" : ""}`}
                onClick={() => onCategorySelect(cat.toLowerCase())}
            >
                {cat.toUpperCase()}
            </button>
            ))}
        </div>

        <div className="nav-right">
            <button
            className={`nav-button search-btn ${activeCategory === "searchbar" ? "active" : ""}`}
            onClick={() => onCategorySelect("searchbar")}
            >
            <FaSearch />
            </button>
        </div>
        </div>
  );
}

export default NavBar;
