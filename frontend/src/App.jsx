import "./App.css";
import LeftMenu from "./components/LeftMenu";
import Navbar from "./components/Navbar";
import SongPlayer from "./components/SongPlayer";
import { BrowserRouter as Router } from "react-router-dom";
import { PlayerProvider } from "./contexts/PlayerContext.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import AppRoutes from "./AppRoutes";
import { UserDataProvider } from "./contexts/UserDataContext.jsx";

function App() {
  return (
    <AuthProvider>
      <UserDataProvider>
        <PlayerProvider>
          <Router>
            <AppRoutes />
          </Router>
        </PlayerProvider>
      </UserDataProvider>
    </AuthProvider>
  );
}

export default App;
