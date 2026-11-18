import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Eye, EyeOff, Lock, Phone } from "lucide-react";
import Logo from "../components/Logo.jsx";
import Button from "../components/Button.jsx";
import Field from "../components/Field.jsx";

const pitchPoints = [
  "Dillerga kod orqali ulaning",
  "Buyurtmani bir bosishda bering",
  "Tasdiqlash va yetkazish holatini kuzating",
];

export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: POST /api/auth/login — backend tayyor, keyingi qadamda ulaymiz
    console.log({ phone, password, remember });
  };

  return (
    <div className="flex min-h-screen">
      {/* Brend paneli — faqat kompyuterda (lg+) ko'rinadi */}
      <aside className="hidden w-[44%] max-w-[640px] shrink-0 flex-col justify-between bg-primary p-14 lg:flex">
        <div className="w-fit rounded-[14px] bg-white px-4 py-2.5">
          <Logo className="h-[45.5px] w-[170px]" />
        </div>

        <div className="flex flex-col gap-5 text-white">
          <h1 className="text-[40px] font-bold leading-tight">
            Zavoddan do'kongacha — bir platformada
          </h1>
          <p className="text-base">
            Buyurtmalarni telefon qo'ng'iroqlarisiz, bir joydan boshqaring.
          </p>
          {pitchPoints.map((text) => (
            <div key={text} className="flex items-center gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent">
                <Check size={16} strokeWidth={3} className="text-on-accent" />
              </span>
              <span className="text-base font-medium">{text}</span>
            </div>
          ))}
        </div>

        <p className="text-xs text-white">© 2026 Supplo</p>
      </aside>

      {/* Forma */}
      <main className="flex flex-1 flex-col items-center justify-center gap-8 p-6">
        <Logo className="h-12 w-[168px] lg:hidden" />

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
      </main>
    </div>
  );
}
