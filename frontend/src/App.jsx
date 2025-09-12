import "./App.css";
import { Toaster } from "react-hot-toast";
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
      <Toaster position="top-center" reverseOrder={false} />
    </AuthProvider>
  );
}

export default App;
