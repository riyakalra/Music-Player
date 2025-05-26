import React from 'react';
import "./index.css"

export default function Navbar() {
    const userFirstName = "Riya";
    const intial = userFirstName.charAt(0).toUpperCase();
    return (
        <nav className="navbar">
            <div className='navbar-logo'>MelodyHub</div>
            <div className="navbar-avatar">
                {intial}
            </div>
        </nav>
    )
}