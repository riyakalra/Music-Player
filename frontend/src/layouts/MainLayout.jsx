import Navbar from "../components/Navbar";
import LeftMenu from "../components/LeftMenu";
import SongPlayer from "../components/SongPlayer";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="App">
      <Navbar />
      <div className="main-layout" style={{ display: "flex" }}>
        <LeftMenu />
        <div className="page-content" style={{ flex: 1 }}>
          <Outlet /> {/* nested routes go here */}
        </div>
      </div>
      <SongPlayer />
    </div>
  );
};

export default MainLayout;
