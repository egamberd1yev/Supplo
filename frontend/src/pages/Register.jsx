import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, MapPin, Package, Phone, Store } from "lucide-react";
import AuthLayout from "../components/AuthLayout.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import Button from "../components/Button.jsx";
import Field from "../components/Field.jsx";

const roles = [
  { value: "shop", title: "Do'kon", text: "Mahsulot buyurtma qilaman", icon: Store },
  { value: "dealer", title: "Diller", text: "Mahsulot sotaman", icon: Package },
];

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [role, setRole] = useState("shop");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: POST /api/auth/register (role: "shop" | "dealer" — backenddagi qiymatga moslang)
    console.log({ role, name, phone, city });
    register({ name, role, phone, city }); // parol saqlanmaydi
    // Hozircha faqat do'kon paneli tayyor
    if (role === "shop") navigate("/dokon/katalog");
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="flex w-full max-w-[400px] flex-col gap-[18px]">
        <h2 className="text-[28px] font-bold text-ink">Ro'yxatdan o'tish</h2>
        <p className="text-sm text-muted">
          Supplo'da hisob oching va dillerlar bilan ishlashni boshlang
        </p>

        <p className="text-[13px] font-semibold text-ink">Siz kimsiz?</p>
        <div className="flex gap-3">
          {roles.map(({ value, title, text, icon: Icon }) => {
            const active = role === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setRole(value)}
                className={`flex flex-1 flex-col items-start gap-2 rounded-xl p-3.5 text-left transition ${
                  active
                    ? "border-2 border-primary bg-soft-blue"
                    : "border border-line bg-white hover:border-primary/50"
                }`}
              >
                <span
                  className={`flex size-9 items-center justify-center rounded-[10px] ${
                    active ? "bg-primary text-white" : "bg-soft-blue text-primary"
                  }`}
                >
                  <Icon size={20} />
                </span>
                <span className="text-[15px] font-semibold text-ink">{title}</span>
                <span className="text-xs text-muted">{text}</span>
              </button>
            );
          })}
        </div>

        <Field
          id="name"
          label={role === "shop" ? "Do'kon nomi" : "Diller nomi"}
          icon={Store}
          placeholder="Baraka Qurilish"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Field
          id="phone"
          label="Telefon raqam"
          icon={Phone}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+998 90 123 45 67"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <Field
          id="city"
          label="Shahar"
          icon={MapPin}
          placeholder="Toshkent"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <Field
          id="password"
          label="Parol"
          icon={Lock}
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          minLength={8}
          placeholder="Kamida 8 ta belgi"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          right={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
              className="text-muted hover:text-ink"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          }
        />

        <label className="flex cursor-pointer items-center gap-2 text-[13px] text-muted">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="size-[18px] rounded-[5px] accent-primary"
          />
          Foydalanish shartlariga roziman
        </label>

        <Button type="submit" disabled={!agree} className="h-[50px] w-full">
          Ro'yxatdan o'tish
        </Button>

        <p className="flex items-center justify-center gap-1.5 text-sm text-muted">
          Hisobingiz bormi?
          <Link to="/kirish" className="font-semibold text-primary">
            Kirish
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
