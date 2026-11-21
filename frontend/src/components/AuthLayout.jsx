import { Check } from "lucide-react";
import Logo from "./Logo.jsx";

const pitchPoints = [
  "Dillerga kod orqali ulaning",
  "Buyurtmani bir bosishda bering",
  "Tasdiqlash va yetkazish holatini kuzating",
];

export default function AuthLayout({ children }) {
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

      {/* Forma joyi */}
      <main className="flex flex-1 flex-col items-center justify-center gap-8 p-6">
        <Logo className="h-12 w-[168px] lg:hidden" />
        {children}
      </main>
    </div>
  );
}
