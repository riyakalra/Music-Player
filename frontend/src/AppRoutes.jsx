import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import AuthPage from "./pages/auth";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/auth" element={<AuthPage />} />
      </Route>

      {/* Main routes */}
      <Route element={<MainLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/explore" element={<Explore />} />
      </Route>
    </Routes>
  );
}
