import { colors } from "./theme";

/** The app's cloud-and-pin mark in a frosted tile, as in the demo video's intro. */
export function Logo({ size }) {
    return (
        <svg width={size} height={size} viewBox="0 0 32 32">
            <defs>
                <linearGradient id="weather-logo-bg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="rgba(255,255,255,0.32)" />
                    <stop offset="1" stopColor="rgba(255,255,255,0.10)" />
                </linearGradient>
            </defs>
            <rect x="0.5" y="0.5" width="31" height="31" rx="8.5" fill="url(#weather-logo-bg)" stroke={colors.accent} strokeOpacity="0.7" />
            <g fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {/* Cloud (open at the bottom-right where the pin sits) */}
                <path d="M14.5 21.5H11a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 21.8 12.4" />
                {/* Map pin */}
                <path d="M24.5 19.4c0 2.2-2.9 4.8-2.9 4.8s-2.9-2.6-2.9-4.8a2.9 2.9 0 0 1 5.8 0Z" />
                <circle cx="21.6" cy="19.4" r="0.9" fill="#fff" stroke="none" />
            </g>
        </svg>
    );
}
