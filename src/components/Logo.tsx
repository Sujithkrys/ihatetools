import Link from "next/link";

interface LogoProps {
  size?: number;
  className?: string;
  textClassName?: string;
  cutoutColor?: string;
  href?: string;
}

export function Logo({
  size = 22,
  className = "",
  textClassName = "logo",
  cutoutColor = "var(--color-bg)",
  href = "/",
}: LogoProps) {
  return (
    <Link href={href} className={`inline-flex items-center gap-2 no-underline ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect x="8.3" y="5.0" width="7.4" height="1.9" rx="0.95" fill="currentColor" />
        <rect x="8.3" y="5.8" width="1.9" height="5.0" rx="0.95" fill="currentColor" />
        <rect x="13.8" y="5.8" width="1.9" height="5.0" rx="0.95" fill="currentColor" />
        <rect x="4.2" y="10.3" width="15.6" height="8.7" rx="2.1" fill="currentColor" />
        <rect x="4.2" y="13.6" width="15.6" height="2.0" fill={cutoutColor} />
        <circle cx="12" cy="14.6" r="1.0" fill="currentColor" />
      </svg>
      <span className={`${textClassName} whitespace-nowrap`}>
        i<span className="line-through decoration-2 decoration-[#E5342B]">hate</span>tools
      </span>
    </Link>
  );
}
