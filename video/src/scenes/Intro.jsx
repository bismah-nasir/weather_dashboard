import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Logo } from "../components/Logo";
import { sceneOpacity } from "../components/fade";

const TITLE = "Weather Dashboard";
const CHIPS = ["React", "Vite", "Tailwind CSS", "Recharts", "OpenWeather API"];

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };

export const Intro = ({ duration }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const logo = spring({ frame: frame - 4, fps, config: { damping: 11, stiffness: 110 } });
    const exitScale = interpolate(frame, [duration - 15, duration], [1, 1.25], clamp);

    return (
        <AbsoluteFill
            style={{
                opacity: sceneOpacity(frame, duration, 1, 12),
                transform: `scale(${exitScale})`,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
            }}>
            <div style={{ position: "relative", marginBottom: 44 }}>
                {/* Pulsing rings behind the logo */}
                {[0, 1, 2].map((i) => {
                    const start = 10 + i * 14;
                    if (frame < start) return null;
                    const t = ((frame - start) % 45) / 45;
                    const size = 200 + t * 380;
                    return (
                        <div
                            key={i}
                            style={{
                                position: "absolute",
                                left: "50%",
                                top: "50%",
                                width: size,
                                height: size,
                                transform: "translate(-50%, -50%)",
                                borderRadius: "50%",
                                border: "3px solid rgba(103,232,249,0.7)",
                                opacity: 1 - t,
                            }}
                        />
                    );
                })}
                <div style={{ transform: `scale(${logo}) rotate(${(1 - logo) * -90}deg)` }}>
                    <Logo size={190} glow={logo} />
                </div>
            </div>

            <div style={{ display: "flex", fontSize: 118, fontWeight: 800, color: "white", letterSpacing: -2 }}>
                {TITLE.split("").map((ch, i) => {
                    const s = spring({ frame: frame - 18 - i * 1.6, fps, config: { damping: 13 } });
                    return (
                        <span
                            key={i}
                            style={{
                                display: "inline-block",
                                whiteSpace: "pre",
                                opacity: s,
                                transform: `translateY(${(1 - s) * 80}px) rotate(${(1 - s) * 12}deg)`,
                                textShadow: "0 10px 40px rgba(0,0,0,0.35)",
                            }}>
                            {ch}
                        </span>
                    );
                })}
            </div>

            <div
                style={{
                    marginTop: 18,
                    fontSize: 38,
                    color: "rgba(255,255,255,0.88)",
                    fontWeight: 500,
                    opacity: interpolate(frame, [42, 56], [0, 1], clamp),
                    transform: `translateY(${interpolate(frame, [42, 56], [20, 0], clamp)}px)`,
                }}>
                Real-time weather, forecasts &amp; air quality for any city
            </div>

            <div style={{ display: "flex", gap: 18, marginTop: 44 }}>
                {CHIPS.map((chip, i) => {
                    const s = spring({ frame: frame - 56 - i * 4, fps, config: { damping: 12 } });
                    return (
                        <div
                            key={chip}
                            style={{
                                padding: "12px 28px",
                                borderRadius: 999,
                                fontSize: 26,
                                fontWeight: 600,
                                color: "white",
                                background: "rgba(255,255,255,0.15)",
                                border: "1.5px solid rgba(255,255,255,0.35)",
                                transform: `scale(${s})`,
                                opacity: s,
                            }}>
                            {chip}
                        </div>
                    );
                })}
            </div>
        </AbsoluteFill>
    );
};
