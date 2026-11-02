import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";


const BLOBS = [
    { x: 15, y: 20, size: 700, color: "rgba(59,130,246,0.55)", speed: 0.011, phase: 0 },
    { x: 85, y: 30, size: 650, color: "rgba(20,184,166,0.5)", speed: 0.009, phase: 2 },
    { x: 60, y: 85, size: 800, color: "rgba(14,116,144,0.55)", speed: 0.007, phase: 4 },
    { x: 30, y: 75, size: 500, color: "rgba(103,232,249,0.25)", speed: 0.013, phase: 1 },
];

// Deterministic particles drifting upward like light rain reversed / dust
const PARTICLES = Array.from({ length: 40 }, (_, i) => ({
    x: (i * 137.5) % 100,
    y: (i * 61.8) % 100,
    r: 1.5 + ((i * 7) % 4),
    speed: 0.04 + ((i * 13) % 10) / 120,
    opacity: 0.15 + ((i * 11) % 10) / 30,
}));

export const Background = () => {
    const frame = useCurrentFrame();
    const angle = 135 + Math.sin(frame / 90) * 15;
    // Night tint while the day/night scene plays
    const night = interpolate(frame, [730, 770, 800, 830], [0, 1, 1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    return (
        <AbsoluteFill>
            <AbsoluteFill
                style={{
                    background: `linear-gradient(${angle}deg, #1d4ed8 0%, #0f766e 55%, #0e7490 100%)`,
                }}
            />
            {BLOBS.map((b, i) => (
                <div
                    key={i}
                    style={{
                        position: "absolute",
                        left: `${b.x + Math.sin(frame * b.speed + b.phase) * 8}%`,
                        top: `${b.y + Math.cos(frame * b.speed + b.phase) * 8}%`,
                        width: b.size,
                        height: b.size,
                        marginLeft: -b.size / 2,
                        marginTop: -b.size / 2,
                        borderRadius: "50%",
                        background: `radial-gradient(circle, ${b.color} 0%, transparent 70%)`,
                        filter: "blur(40px)",
                    }}
                />
            ))}
            {PARTICLES.map((p, i) => {
                const y = (p.y - frame * p.speed + 200) % 100;
                return (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            left: `${p.x}%`,
                            top: `${y}%`,
                            width: p.r * 2,
                            height: p.r * 2,
                            borderRadius: "50%",
                            background: "white",
                            opacity: p.opacity * (0.6 + 0.4 * Math.sin(frame / 20 + i)),
                        }}
                    />
                );
            })}
            <AbsoluteFill
                style={{
                    background: "linear-gradient(135deg, #171717 0%, #000 50%, #374151 100%)",
                    opacity: night * 0.9,
                }}
            />
            <AbsoluteFill
                style={{
                    background: "radial-gradient(ellipse at center, transparent 50%, rgba(2,6,23,0.55) 100%)",
                }}
            />
        </AbsoluteFill>
    );
};
