import "./App.css";
import LeftMenu from "./components/LeftMenu";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";

function App() {
  return (
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
  );
}

export default App;
