import { createContext, useContext, useState } from "react";

// Vaqtincha: ro'yxatdan o'tgan foydalanuvchi ma'lumoti brauzerda (localStorage) saqlanadi.
// Parol saqlanmaydi. Backend ulanganda shu yerga haqiqiy login/token keladi.
const STORAGE_KEY = "supplo_user";
const demoUser = { name: "Baraka Qurilish", role: "shop" };

const readUser = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writeUser = (user) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch {
    /* localStorage ishlamasa e'tibor bermaymiz */
  }
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readUser() ?? demoUser);

  const register = ({ name, role, phone, city }) => {
    const next = { name: name.trim() || demoUser.name, role, phone, city };
    writeUser(next);
    setUser(next);
  };

  // TODO: backend ulanganda tokenni o'chirish shu yerda bo'ladi
  const logout = () => {};

  return <AuthContext.Provider value={{ user, register, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
