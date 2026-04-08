interface LogoProps {
  className?: string;
  size?: number;
}

export default function Logo({ className = "", size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Racket head — oval with string pattern */}
      <ellipse
        cx="32"
        cy="22"
        rx="16"
        ry="20"
        stroke="var(--color-accent, #f7c948)"
        strokeWidth="3"
        fill="none"
      />

      {/* Strings — vertical */}
      <line x1="26" y1="5" x2="26" y2="39" stroke="var(--color-accent, #f7c948)" strokeWidth="1" opacity="0.5" />
      <line x1="32" y1="3" x2="32" y2="41" stroke="var(--color-accent, #f7c948)" strokeWidth="1" opacity="0.5" />
      <line x1="38" y1="5" x2="38" y2="39" stroke="var(--color-accent, #f7c948)" strokeWidth="1" opacity="0.5" />

      {/* Strings — horizontal */}
      <line x1="17" y1="14" x2="47" y2="14" stroke="var(--color-accent, #f7c948)" strokeWidth="1" opacity="0.5" />
      <line x1="16" y1="22" x2="48" y2="22" stroke="var(--color-accent, #f7c948)" strokeWidth="1" opacity="0.5" />
      <line x1="17" y1="30" x2="47" y2="30" stroke="var(--color-accent, #f7c948)" strokeWidth="1" opacity="0.5" />

      {/* Handle */}
      <rect
        x="29"
        y="40"
        width="6"
        height="18"
        rx="2"
        fill="var(--color-primary, #ff6b35)"
      />

      {/* Grip texture lines */}
      <line x1="30" y1="46" x2="34" y2="46" stroke="var(--color-bg, #0f0f0f)" strokeWidth="1" opacity="0.4" />
      <line x1="30" y1="50" x2="34" y2="50" stroke="var(--color-bg, #0f0f0f)" strokeWidth="1" opacity="0.4" />
      <line x1="30" y1="54" x2="34" y2="54" stroke="var(--color-bg, #0f0f0f)" strokeWidth="1" opacity="0.4" />

      {/* Ball — small circle with motion trail */}
      <circle cx="46" cy="8" r="4" fill="var(--color-primary, #ff6b35)" />
      <circle cx="46" cy="8" r="4" fill="var(--color-primary, #ff6b35)" opacity="0.3" transform="translate(3, -2)" />
    </svg>
  );
}
