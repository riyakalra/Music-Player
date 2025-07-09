import "./App.css";
import LeftMenu from "./components/LeftMenu";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PlayerProvider } from "./contexts/PlayerContext.jsx";

import Home from "./pages/Home";

function App() {
  return (
    <PlayerProvider>
    <Router>
      <div className="App">
        <Navbar />
        <div className="main-layout" style={{ display: "flex" }}>
          <LeftMenu />
          <div className="page-content" style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
    </PlayerProvider>
  );
}

export default App;
