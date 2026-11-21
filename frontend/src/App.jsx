import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ShopProvider } from "./context/ShopContext.jsx";
import ShopLayout from "./layouts/ShopLayout.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Catalog from "./pages/shop/Catalog.jsx";
import Cart from "./pages/shop/Cart.jsx";
import Orders from "./pages/shop/Orders.jsx";
import Saved from "./pages/shop/Saved.jsx";
import Dealers from "./pages/shop/Dealers.jsx";

const DEFAULT_PAGE = "/dokon/katalog";

export default function App() {
  return (
    <AuthProvider>
      <ShopProvider>
        <Routes>
          <Route path="/kirish" element={<Login />} />
          <Route path="/royxatdan-otish" element={<Register />} />

          {/* Do'kon paneli */}
          <Route path="/dokon" element={<ShopLayout />}>
            <Route index element={<Navigate to="katalog" replace />} />
            <Route path="katalog" element={<Catalog />} />
            <Route path="savat" element={<Cart />} />
            <Route path="buyurtmalar" element={<Orders />} />
            <Route path="saqlangan" element={<Saved />} />
            <Route path="dillerlar" element={<Dealers />} />
          </Route>

          {/* "/" va noma'lum manzillar — Katalogga */}
          <Route path="*" element={<Navigate to={DEFAULT_PAGE} replace />} />
        </Routes>
      </ShopProvider>
    </AuthProvider>
  );
}
