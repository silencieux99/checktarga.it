import Link from "next/link";
import LogoMark from "./LogoMark";

type LogoSize = "sm" | "md" | "lg";
type LogoVariant = "default" | "inverse" | "admin";

type LogoProps = {
  size?: LogoSize;
  variant?: LogoVariant;
  showMark?: boolean;
  href?: string | null;
  className?: string;
};

const TEXT_SIZE: Record<LogoSize, string> = {
  sm: "text-[15px]",
  md: "text-[17px] md:text-[19px]",
  lg: "text-[22px] md:text-[28px]",
};

const MARK_SIZE: Record<LogoSize, number> = {
  sm: 28,
  md: 36,
  lg: 44,
};

const VARIANT_STYLES: Record<
  LogoVariant,
  { word: string; accent: string; suffix?: string; mark: "default" | "inverse" | "light" }
> = {
  default: {
    word: "text-brand",
    accent: "text-brand-accent",
    mark: "default",
  },
  inverse: {
    word: "text-white",
    accent: "text-emerald-400",
    mark: "inverse",
  },
  admin: {
    word: "text-white",
    accent: "text-emerald-400",
    suffix: "text-slate-400",
    mark: "inverse",
  },
};

export default function Logo({
  size = "md",
  variant = "default",
  showMark = true,
  href = "/",
  className = "",
}: LogoProps) {
  const styles = VARIANT_STYLES[variant];

  const content = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {showMark && (
        <LogoMark size={MARK_SIZE[size]} variant={styles.mark} className="shrink-0" />
      )}
      <span className={`inline-flex items-baseline leading-none ${TEXT_SIZE[size]}`}>
        <span className={`font-light tracking-[0.03em] ${styles.word}`}>check</span>
        <span className={`font-semibold tracking-[-0.03em] ${styles.word}`}>targa</span>
        <span
          className={`ml-1 align-top text-[0.58em] font-bold uppercase tracking-[0.24em] ${styles.accent}`}
        >
          .it
        </span>
        {variant === "admin" && (
          <span className={`ml-2 text-[0.72em] font-medium tracking-normal ${styles.suffix}`}>
            Admin
          </span>
        )}
      </span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="group inline-flex transition-opacity hover:opacity-90">
        {content}
      </Link>
    );
  }

  return content;
}
