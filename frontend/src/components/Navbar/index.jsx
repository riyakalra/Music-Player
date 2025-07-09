import React, { useState } from "react";
import "./index.css";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { searchSongs } from "../../utils/songsAPI";
import { createPortal } from "react-dom";

export default function Navbar() {
  const userFirstName = "Riya";
  const initial = userFirstName.charAt(0).toUpperCase();

  const [searchResults, setSearchResults] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async (query) => {
    if (!query) {
      setSearchResults(null);
      setSearchQuery("");
      return;
    }
    try {
      const results = await searchSongs(query);
      setSearchQuery(query);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching songs:", error);
      setSearchResults([]);
    }
  };

  const handleClearSearch = () => {
    setSearchResults(null);
    setSearchQuery("");
  };

  return (
    <nav className="navbar">
      <div className="navbar-section left">
        <div className="navbar-logo">MelodyHub</div>
      </div>

      <div className="navbar-section center desktop-search">
        <div className="navbar-search">
          <MagnifyingGlassIcon className="search-icon" />
          <input
            type="text"
            placeholder="Search Here"
            className="search-input"
            onChange={(e) => handleSearch(e.target.value)}
          />
          {searchResults && searchResults.length > 0 && (
            <XMarkIcon className="clear-icon" onClick={handleClearSearch} />
          )}
        </div>

        {searchQuery.length > 0 &&
          createPortal(
            <div className="search-results">
              {searchResults.length > 0
                ? searchResults.map((song) => (
                    <div key={song.id} className="search-result-item">
                      <img
                        src={song.image}
                        alt={song.title}
                        className="result-image"
                      />
                      <div className="result-info">
                        <div className="result-title">{song.title}</div>
                        <div className="result-artists">
                          {song.artists.join(", ")}
                        </div>
                      </div>
                    </div>
                  ))
                : "No search results found."}
            </div>,
            document.getElementById("search-portal")
          )}
      </div>

      <div className="navbar-section right">
        <div className="navbar-search mobile-search">
          <MagnifyingGlassIcon className="search-icon" />
          <input type="text" placeholder="Search" className="search-input" />
        </div>
        <div className="navbar-avatar">{initial}</div>
      </div>
    </nav>
  );
}
