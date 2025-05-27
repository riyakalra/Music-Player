import React from "react";
import "./index.css";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

export default function Navbar() {
  const userFirstName = "Riya";
  const initial = userFirstName.charAt(0).toUpperCase();

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
          />
        </div>
      </div>

      <div className="navbar-section right">
        <div className="navbar-search mobile-search">
          <MagnifyingGlassIcon className="search-icon" />
          <input
            type="text"
            placeholder="Search"
            className="search-input"
          />
        </div>
        <div className="navbar-avatar">{initial}</div>
      </div>
    </nav>
  );
}
