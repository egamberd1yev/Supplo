import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Lock, Phone } from "lucide-react";
import AuthLayout from "../components/AuthLayout.jsx";
import Button from "../components/Button.jsx";
import Field from "../components/Field.jsx";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: POST /api/auth/login
    console.log({ phone, password, remember });
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="flex w-full max-w-[400px] flex-col gap-[18px]">
        <h2 className="text-[28px] font-bold text-ink">Kirish</h2>
        <p className="text-sm text-muted">Hisobingizga telefon raqamingiz bilan kiring</p>

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
          id="password"
          label="Parol"
          icon={Lock}
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          placeholder="••••••••"
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

        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-[13px] text-muted">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="size-[18px] rounded-[5px] accent-primary"
            />
            Eslab qolish
          </label>
          <button type="button" className="text-[13px] font-semibold text-primary">
            Parolni unutdingizmi?
          </button>
        </div>

        <Button type="submit" className="h-[50px] w-full">
          Kirish
        </Button>

        <p className="flex items-center justify-center gap-1.5 text-sm text-muted">
          Hisobingiz yo'qmi?
          <Link to="/royxatdan-otish" className="font-semibold text-primary">
            Ro'yxatdan o'tish
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}