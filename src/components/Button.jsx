export default function Button({
  label,
  onClick,
  variant = "primary",
  disabled = false,
  type = "button",
  current,
}) {
  return (
    <button
      type={type}
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
      aria-current={current ? "page" : undefined}
    >
      {label}
    </button>
  );
}
