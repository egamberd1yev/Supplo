const variants = {
  accent: "bg-accent text-on-accent hover:brightness-95",
  outline: "bg-white text-primary border-[1.5px] border-primary hover:bg-soft-blue",
};

const sizes = {
  md: "px-5 py-3.5 text-[15px]",
  sm: "px-3.5 py-2 text-[13px]",
  compact: "px-4 py-[11px] text-sm",
};

export default function Button({
  as: Tag = "button",
  variant = "accent",
  size = "md",
  className = "",
  children,
  ...props
}) {
  return (
    <Tag
      className={`inline-flex items-center justify-center rounded-[10px] font-semibold transition disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
