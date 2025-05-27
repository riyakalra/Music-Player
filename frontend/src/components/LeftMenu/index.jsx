import "./index.css";
import {
  HomeIcon,
  HeartIcon,
  GlobeAltIcon,
  MusicalNoteIcon,
} from "@heroicons/react/24/outline";

export default function LeftMenu() {
  return (
    <nav className="left-menu">
      <div className="left-menu-section">
        <h2 className="left-menu-heading">MENU</h2>
        <ul className="left-menu-list">
          <li className="left-menu-item">
            <HomeIcon className="left-menu-icon" />
            Home
          </li>
          <li className="left-menu-item">
          <GlobeAltIcon className="left-menu-icon" />
            Explore
          </li>
        </ul>
      </div>

      <div className="left-menu-section">
        <h2 className="left-menu-heading">LIBRARY</h2>
        <ul className="left-menu-list">
          <li className="left-menu-item">
            <HeartIcon className="left-menu-icon" />
            Favourites
          </li>
          <li className="left-menu-item">
            <MusicalNoteIcon className="left-menu-icon" />
            My Playlists
          </li>
        </ul>
      </div>
    </nav>
  );
}
