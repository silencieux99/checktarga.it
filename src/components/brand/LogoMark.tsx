type LogoMarkProps = {
  size?: number;
  variant?: "default" | "inverse" | "light";
  className?: string;
};

export default function LogoMark({
  size = 36,
  variant = "default",
  className = "",
}: LogoMarkProps) {
  const bg = variant === "light" ? "#ffffff" : "#0f172a";
  const letter = variant === "light" ? "#0f172a" : "#ffffff";
  const accent = "#059669";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
    >
      <rect width="40" height="40" rx="11" fill={bg} />
      <path
        d="M24.5 12.5C22.4 10.8 19.8 10 17 10C11.75 10 7.5 14.25 7.5 19.5C7.5 24.75 11.75 29 17 29C19.8 29 22.4 28.2 24.5 26.5"
        stroke={letter}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M27.5 14.5L30.5 17.5L35.5 12"
        stroke={accent}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
