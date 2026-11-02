import { interpolate } from "remotion";

// Mouse pointer with a click ripple. `clickAge` = frames since last click (or null)
export const Cursor = ({ x, y, opacity = 1, clickAge = null }) => {
    const pressed = clickAge != null && clickAge >= 0 && clickAge < 6;
    const ripple =
        clickAge != null && clickAge >= 0 && clickAge < 22
            ? interpolate(clickAge, [0, 22], [0, 1])
            : null;
    return (
        <div style={{ position: "absolute", left: x, top: y, opacity, pointerEvents: "none" }}>
            {ripple != null && (
                <div
                    style={{
                        position: "absolute",
                        left: -40 * ripple - 6,
                        top: -40 * ripple - 6,
                        width: 80 * ripple + 12,
                        height: 80 * ripple + 12,
                        borderRadius: "50%",
                        border: "4px solid rgba(253,224,71,0.9)",
                        opacity: 1 - ripple,
                    }}
                />
            )}
            <svg
                width="44"
                height="44"
                viewBox="0 0 24 24"
                style={{
                    transform: `scale(${pressed ? 0.85 : 1})`,
                    transformOrigin: "0 0",
                    filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.45))",
                }}>
                <path
                    d="M3 2 L3 19 L7.5 14.8 L10.6 21.6 L13.6 20.3 L10.6 13.6 L17 13.6 Z"
                    fill="white"
                    stroke="#0f172a"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
};
