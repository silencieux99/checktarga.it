import { PRIVATE_SERVICE_DISCLAIMER } from "@/lib/company";

interface PrivateServiceDisclaimerProps {
  variant?: "default" | "compact" | "footer";
  className?: string;
}

export default function PrivateServiceDisclaimer({
  variant = "default",
  className = "",
}: PrivateServiceDisclaimerProps) {
  const paragraphs = PRIVATE_SERVICE_DISCLAIMER.split("\n\n");

  if (variant === "footer") {
    return (
      <div className={`space-y-2 text-sm leading-relaxed text-white/85 ${className}`}>
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <p className={`text-sm leading-relaxed text-slate-700 ${className}`}>
        {paragraphs.join(" ")}
      </p>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm leading-relaxed text-slate-800 ${className}`}
    >
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className={paragraph !== paragraphs[0] ? "mt-2" : undefined}>
          {paragraph}
        </p>
      ))}
    </div>
  );
}
