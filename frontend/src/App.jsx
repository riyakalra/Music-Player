import "./App.css";
import LeftMenu from "./components/LeftMenu";
import Navbar from "./components/Navbar";
import SongPlayer from "./components/SongPlayer";
import { BrowserRouter as Router } from "react-router-dom";
import { PlayerProvider } from "./contexts/PlayerContext.jsx";
import AppRoutes from "./AppRoutes";

function App() {
  return (
    <PlayerProvider>
      <Router>
        <div className="App">
          <Navbar />
          <div className="main-layout" style={{ display: "flex" }}>
            <LeftMenu />
            <div className="page-content" style={{ flex: 1 }}>
              <AppRoutes /> 
            </div>
          </div>
          <SongPlayer />
        </div>
      </Router>
    </PlayerProvider>
  );
}

export default App;
