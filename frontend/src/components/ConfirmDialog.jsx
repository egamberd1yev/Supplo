import { useEffect } from "react";
import Button from "./Button.jsx";

export default function ConfirmDialog({
  open,
  title,
  text,
  confirmText = "Ha",
  cancelText = "Bekor qilish",
  onConfirm,
  onCancel,
}) {
  // Escape bosilganda yopiladi
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4"
      onClick={onCancel}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="w-full max-w-[400px] rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-title" className="text-lg font-bold text-ink">
          {title}
        </h2>
        {text && <p className="mt-2 text-sm text-muted">{text}</p>}
        <div className="mt-6 flex gap-3">
          <Button variant="outline" size="compact" className="flex-1" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button size="compact" className="flex-1" onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
