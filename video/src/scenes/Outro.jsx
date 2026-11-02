import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Logo } from "../components/Logo";
import { sceneOpacity } from "../components/fade";

const FEATURES = ["City search", "Hourly chart", "5-day forecast", "Air quality", "Favourites", "Day / Night"];
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };

export const Outro = ({ duration }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const logo = spring({ frame: frame - 2, fps, config: { damping: 10, stiffness: 120 } });
    const title = spring({ frame: frame - 10, fps, config: { damping: 14 } });
    const link = spring({ frame: frame - 40, fps, config: { damping: 14 } });
    const float = Math.sin(frame / 12) * 8;

    return (
        <AbsoluteFill
            style={{
                opacity: sceneOpacity(frame, duration, 10, 1),
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
            }}>
            <div style={{ transform: `scale(${logo}) translateY(${float}px)` }}>
                <Logo size={150} />
            </div>

            <div
                style={{
                    marginTop: 34,
                    fontSize: 96,
                    fontWeight: 800,
                    color: "white",
                    letterSpacing: -2,
                    opacity: title,
                    transform: `translateY(${(1 - title) * 50}px)`,
                    textShadow: "0 10px 40px rgba(0,0,0,0.35)",
                }}>
                Weather Dashboard
            </div>

            <div style={{ display: "flex", gap: 14, marginTop: 30 }}>
                {FEATURES.map((f, i) => {
                    const s = spring({ frame: frame - 20 - i * 3, fps, config: { damping: 12 } });
                    return (
                        <div
                            key={f}
                            style={{
                                padding: "10px 22px",
                                borderRadius: 999,
                                fontSize: 24,
                                fontWeight: 500,
                                color: "white",
                                background: "rgba(255,255,255,0.14)",
                                border: "1.5px solid rgba(255,255,255,0.3)",
                                opacity: s,
                                transform: `translateY(${(1 - s) * 30}px)`,
                            }}>
                            {f}
                        </div>
                    );
                })}
            </div>

            <div
                style={{
                    marginTop: 54,
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "18px 36px",
                    borderRadius: 999,
                    background: "rgba(15,23,42,0.75)",
                    border: "2px solid rgba(103,232,249,0.7)",
                    boxShadow: `0 0 ${30 + 20 * Math.sin(frame / 8)}px rgba(103,232,249,0.5)`,
                    color: "white",
                    fontSize: 32,
                    fontWeight: 600,
                    opacity: link,
                    transform: `scale(${0.8 + link * 0.2})`,
                }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="white">
                    <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.27 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z" />
                </svg>
                github.com/bismah-nasir/weather_dashboard
            </div>

            <div
                style={{
                    marginTop: 26,
                    fontSize: 26,
                    color: "rgba(255,255,255,0.75)",
                    opacity: interpolate(frame, [55, 68], [0, 1], clamp),
                }}>
                Built with React · Vite · Tailwind CSS · Recharts · OpenWeather API
            </div>
        </AbsoluteFill>
    );
};
