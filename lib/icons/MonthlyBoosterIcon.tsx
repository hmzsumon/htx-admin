"use client";
import * as React from "react";
/* ── module: MonthlyBoosterIcon ─────────────────────────────── */

/* ── props ─────────────────────────────── */
export interface MonthlyBoosterIconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Pixel size for width & height. Accepts number (px) or any CSS length string (e.g., '1.5rem').
   */
  size?: number | string;
  /**
   * Stroke width for the outline (in SVG units).
   */
  strokeWidth?: number;
  /**
   * If true, uses a gold gradient stroke. If false, uses currentColor.
   */
  gold?: boolean;
  /**
   * Adds a soft glow behind the strokes.
   */
  glow?: boolean;
  /**
   * Adds a subtle shimmering animation to the gradient glow.
   */
  animated?: boolean;
  /**
   * Accessible title. Pass undefined to mark as decorative (aria-hidden).
   */
  title?: string;
}

/**
 * MonthlyBoosterIcon — Coins + Lightning ("booster") with optional golden glow
 *
 * Usage:
 * <MonthlyBoosterIcon size={28} gold glow animated className="align-middle" />
 * <MonthlyBoosterIcon size="2rem" strokeWidth={2} gold={false} className="text-gray-700" />
 */
/* ── component ─────────────────────────────── */
export const MonthlyBoosterIcon = React.forwardRef<
  SVGSVGElement,
  MonthlyBoosterIconProps
>(
  (
    {
      size = 24,
      strokeWidth = 1.8,
      gold = true,
      glow = true,
      animated = false,
      title = "Monthly Booster",
      className,
      ...rest
    },
    ref
  ) => {
    const gradientId = React.useId();
    const filterId = React.useId();

    const stroke = gold ? `url(#${gradientId})` : "currentColor";
    const numericSize = typeof size === "number" ? `${size}` : size;

    // Build a reusable <g> with the icon's paths
    const IconPaths = (
      <>
        {/* ── left coin stack ─────────────────────────────── */}
        <ellipse cx="7.5" cy="9" rx="4.5" ry="2" />
        <path d="M3 9v3c0 1.1 2 2 4.5 2s4.5-.9 4.5-2V9" />
        <path d="M3 12v3c0 1.1 2 2 4.5 2s4.5-.9 4.5-2v-3" />
        {/* ── lightning bolt (booster) ─────────────────────────────── */}
        <path d="M16 6l-2 5h3l-3 7l7-9h-3l2-3z" />
      </>
    );

    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={numericSize}
        height={numericSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden={title ? undefined : true}
        role={title ? "img" : "presentation"}
        {...rest}
      >
        {title ? <title>{title}</title> : null}
        /* ── defs: gradients & filters ─────────────────────────────── */
        <defs>
          {/* ── golden gradient for stroke ─────────────────────────────── */}
          <linearGradient
            id={gradientId}
            x1="0"
            y1="0"
            x2="24"
            y2="24"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FFF8DC" />
            <stop offset="25%" stopColor="#FFE08A" />
            <stop offset="55%" stopColor="#FFC94A" />
            <stop offset="85%" stopColor="#FFB800" />
            <stop offset="100%" stopColor="#FFE08A" />
            {animated && (
              <animateTransform
                attributeName="gradientTransform"
                type="translate"
                values="0 0; 12 0; 0 0"
                dur="2.8s"
                repeatCount="indefinite"
              />
            )}
          </linearGradient>

          {/* ── soft glow filter ─────────────────────────────── */}
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            {/* ── expand & blur for halo ─────────────────────────────── */}
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="2.2"
              result="blur"
            />
            {/* ── warm tone adjustment ─────────────────────────────── */}
            <feColorMatrix
              in="blur"
              type="matrix"
              values="0.98 0   0   0   0
                      0.85 0.9 0   0   0
                      0     0.7 0.05 0   0
                      0     0   0   1   0"
              result="warm"
            />
            <feMerge>
              <feMergeNode in="warm" />
              {/* ── keep crisp outline separate ─────────────────────────────── */}
            </feMerge>
          </filter>
        </defs>
        {/* ── glow layer (underlay) ─────────────────────────────── */}
        {glow && (
          <g
            transform="translate(0 0)"
            style={{
              filter: `url(#${filterId})`,
              opacity: 0.85,
            }}
          >
            <g
              stroke={stroke}
              strokeWidth={strokeWidth + 2.6}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {IconPaths}
            </g>
          </g>
        )}
        {/* ── crisp outline (top) ─────────────────────────────── */}
        <g>{IconPaths}</g>
      </svg>
    );
  }
);
MonthlyBoosterIcon.displayName = "MonthlyBoosterIcon";

export default MonthlyBoosterIcon;
