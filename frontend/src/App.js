import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Leaderboard from "./pages/Leaderboard";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
<Route
  path="/admin"
  element={
    localStorage.getItem("admin") === "true"
      ? <Admin />
      : <Navigate to="/admin-login" />
  }
/>        <Route path="/admin-login" element={<AdminLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;