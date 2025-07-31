import React, { useState, useRef, useEffect } from "react";
import "./index.css";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { searchSongs } from "../../utils/songsAPI";
import { createPortal } from "react-dom";
import { usePlayer } from "../../contexts/PlayerContext.jsx";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const userFirstName = "Riya";
  const initial = userFirstName.charAt(0).toUpperCase();

  const { setCurrentSong } = usePlayer();
  const inputContainerRef = useRef(null);
  const dropdownRef = useRef(null);

  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        inputContainerRef.current &&
        !inputContainerRef.current.contains(e.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setSearchResults([]);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async() => {
    try {
      const auth = getAuth();
      await signOut(auth);
      navigate("/auth")
    } catch (error) {
      console.error("Error during logout:", error);
    }
   
  }

  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await searchSongs(query);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching songs:", error);
      setSearchResults([]);
    }
  };

  const handleClearSearch = () => {
    setSearchResults([]);
    setSearchQuery("");
  };

  return (
    <>
    <nav className="navbar">
      <div className="navbar-section left">
        <div className="navbar-logo">MelodyHub</div>
      </div>

      <div className="navbar-section center desktop-search">
        <div className="navbar-search" ref={inputContainerRef}>
          <MagnifyingGlassIcon className="search-icon" />
          <input
            type="text"
            placeholder="Search Here"
            className="search-input"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {searchResults.length > 0 && (
            <XMarkIcon className="clear-icon" onClick={handleClearSearch} />
          )}
        </div>

        {searchQuery.length > 0 &&
          createPortal(
            <div className="search-results" ref={dropdownRef}>
              {searchResults.length > 0
                ? searchResults.map((song) => (
                    <div
                      key={song.id}
                      className="search-result-item"
                      onClick={() => setCurrentSong(song)}
                    >
                      <img
                        src={song.image}
                        alt={song.title}
                        className="result-image"
                      />
                      <div className="result-info">
                        <div className="result-title">{song.title}</div>
                        <div className="result-artists">
                          {`${song.album} | ${song.artists.join(", ")}`}
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
        <div
          className="navbar-avatar"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {initial}
        </div>
      </div>
    </nav>

    {isDropdownOpen && (
      <div className="user-dropdown" ref={dropdownRef}>
        <div className="dropdown-item" onClick={handleLogout}>Logout</div>
      </div>
    )}
    </>
  );
}
