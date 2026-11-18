const variants = {
  accent: "bg-accent text-on-accent hover:brightness-95",
  outline: "bg-white text-primary border-[1.5px] border-primary hover:bg-soft-blue",
};

const sizes = {
  md: "px-5 py-3.5 text-[15px]",
  sm: "px-3.5 py-2 text-[13px]",
};

export default function Button({
  variant = "accent",
  size = "md",
  className = "",
  children,
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-[10px] font-semibold transition disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
