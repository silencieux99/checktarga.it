interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "blue" | "teal" | "white" | "gray";
  className?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

const colorClasses = {
  blue: "border-blue-600",
  teal: "border-teal-700",
  white: "border-white",
  gray: "border-gray-600",
};

export default function LoadingSpinner({
  size = "md",
  color = "teal",
  className = "",
}: LoadingSpinnerProps) {
  return (
    <div
      className={`animate-spin rounded-full border-2 border-t-transparent ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      role="status"
      aria-label="Caricamento"
    >
      <span className="sr-only">Caricamento...</span>
    </div>
  );
}
