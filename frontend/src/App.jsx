import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/kirish" replace />} />
      <Route path="/kirish" element={<Login />} />
      <Route path="/royxatdan-otish" element={<Register />} />
    </Routes>
  );
}