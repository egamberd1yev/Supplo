import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Bookmark, ClipboardList, LayoutGrid, Link2, LogOut, ShoppingCart } from "lucide-react";
import Logo from "../components/Logo.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getInitials } from "../lib/format.js";

const nav = [
  { to: "/dokon/katalog", label: "Katalog", icon: LayoutGrid },
  { to: "/dokon/savat", label: "Savat", icon: ShoppingCart },
  { to: "/dokon/buyurtmalar", label: "Buyurtmalar", icon: ClipboardList },
  { to: "/dokon/saqlangan", label: "Saqlangan", icon: Bookmark },
  { to: "/dokon/dillerlar", label: "Dillerlar", icon: Link2 },
];

export default function ShopLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const roleLabel = user.role === "dealer" ? "Diller" : "Do'kon";

  const handleLogout = () => {
    logout();
    navigate("/kirish");
  };

  return (
    <div className="min-h-screen bg-page">
      {/* Sidebar — ekranning chap chetida, kompyuterda (lg+) */}
      <aside className="fixed inset-y-0 left-0 hidden w-[260px] flex-col gap-1.5 border-r border-line bg-white px-5 py-6 lg:flex">
        <Logo className="h-[40.1px] w-[150px]" />
        <p className="text-xs font-medium text-muted">Do'kon paneli</p>
        <div className="h-3.5" />

        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-[10px] px-3.5 py-3 text-sm transition ${
                isActive
                  ? "bg-soft-blue font-semibold text-primary"
                  : "font-medium text-muted hover:bg-page"
              }`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}

        <div className="flex-1" />

        {/* Do'kon nomi (ro'yxatdan o'tishda kiritilgan) + chiqish */}
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-soft-blue text-[13px] font-bold text-primary">
            {getInitials(user.name)}
          </span>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-[13px] font-semibold text-ink">{user.name}</p>
            <p className="text-xs text-muted">{roleLabel}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Chiqish"
            title="Chiqish"
            className="shrink-0 rounded-lg p-2 text-muted transition hover:bg-danger-soft hover:text-danger"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      <div className="lg:pl-[260px]">
        {/* Kichik ekranlar uchun vaqtinchalik tepa menyu (planshet/telefon dizayni keyin) */}
        <nav className="flex items-center gap-2 overflow-x-auto border-b border-line bg-white p-3 lg:hidden">
          {nav.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full px-3.5 py-2 text-[13px] ${
                  isActive ? "bg-primary font-semibold text-white" : "bg-page font-medium text-muted"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Chiqish"
            className="ml-auto shrink-0 rounded-lg p-2 text-muted hover:text-danger"
          >
            <LogOut size={18} />
          </button>
        </nav>

        {/* Konteyner: katta ekranda kontent kengayib ketmaydi, o'rtada turadi */}
        <main className="mx-auto flex w-full max-w-[1180px] flex-col gap-5 p-5 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
