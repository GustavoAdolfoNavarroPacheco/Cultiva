"use client";

import { useId } from "react";

type StampBadgeProps = {
  ink: string;
  labelTop: string;
  labelBottom: string;
  center: string;
  rotate?: number;
  className?: string;
};

/**
 * A hand-inked "sello" (rubber stamp) badge — the recurring mark that
 * certifies each of the three pilares, the way a registro office stamp
 * certifies a document in the campo.
 */
export default function StampBadge({
  ink,
  labelTop,
  labelBottom,
  center,
  rotate = -6,
  className = "",
}: StampBadgeProps) {
  const uid = useId().replace(/:/g, "");
  const topPathId = `stamp-top-${uid}`;
  const bottomPathId = `stamp-bottom-${uid}`;
  const filterId = `stamp-rough-${uid}`;

  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      style={{ transform: `rotate(${rotate}deg)`, color: ink }}
      aria-hidden="true"
    >
      <defs>
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012 0.028"
            numOctaves="2"
            seed="7"
            result="noise"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" />
        </filter>
        <path
          id={topPathId}
          d="M 22,100 A 78,78 0 0 1 178,100"
          fill="none"
        />
        <path
          id={bottomPathId}
          d="M 30,128 A 70,70 0 0 0 170,128"
          fill="none"
        />
      </defs>

      <g filter={`url(#${filterId})`} fill="none" stroke="currentColor">
        <circle cx="100" cy="100" r="88" strokeWidth="3.5" opacity="0.9" />
        <circle cx="100" cy="100" r="78" strokeWidth="1.5" opacity="0.75" />
      </g>

      <text
        fill="currentColor"
        fontFamily="var(--font-mono)"
        fontSize="12.5"
        letterSpacing="2.5"
        opacity="0.95"
      >
        <textPath href={`#${topPathId}`} startOffset="50%" textAnchor="middle">
          {labelTop}
        </textPath>
      </text>

      <text
        fill="currentColor"
        fontFamily="var(--font-mono)"
        fontSize="10.5"
        letterSpacing="2"
        opacity="0.85"
      >
        <textPath
          href={`#${bottomPathId}`}
          startOffset="50%"
          textAnchor="middle"
        >
          {labelBottom}
        </textPath>
      </text>

      <text
        x="100"
        y="106"
        fill="currentColor"
        fontFamily="var(--font-display)"
        fontWeight="600"
        fontSize="30"
        textAnchor="middle"
        filter={`url(#${filterId})`}
      >
        {center}
      </text>
    </svg>
  );
}
