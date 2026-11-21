const styles = {
  info: "bg-soft-blue text-primary",
  success: "bg-success-soft text-success",
  warning: "bg-accent-soft text-on-accent",
  danger: "bg-danger-soft text-danger",
};

export default function StatusBadge({ tone = "info", children }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${styles[tone]}`}
    >
      {children}
    </span>
  );
}
