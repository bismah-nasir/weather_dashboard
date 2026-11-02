import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Caption } from "../components/Caption";
import { sceneOpacity } from "../components/fade";
import { SHOT_H, SHOT_W } from "../theme";

const WIN_W = 1240;
const CHROME_H = 50;
const VIEW_H = 620;
const PAGE_H = (SHOT_H * WIN_W) / SHOT_W;

const BADGES = [
    { label: "Live API data", side: "left", y: 470, delay: 40 },
    { label: "Responsive UI", side: "right", y: 560, delay: 52 },
    { label: "Day / Night themes", side: "left", y: 720, delay: 64 },
    { label: "Glassmorphism", side: "right", y: 810, delay: 76 },
];

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };

export const Showcase = ({ duration }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const rise = spring({ frame: frame - 5, fps, config: { damping: 18, stiffness: 70 } });
    const rotateX = interpolate(rise, [0, 1], [55, 0]);
    const translateY = interpolate(rise, [0, 1], [500, 0]);
    const scroll = interpolate(frame, [40, 125], [0, PAGE_H - VIEW_H], {
        ...clamp,
        easing: Easing.inOut(Easing.cubic),
    });
    const exitZoom = interpolate(frame, [duration - 18, duration], [1, 1.12], clamp);
    const badgesOut = interpolate(frame, [duration - 22, duration - 10], [0, 1], clamp);

    return (
        <AbsoluteFill style={{ opacity: sceneOpacity(frame, duration, 10, 12) }}>
            <Caption
                frame={frame - 10}
                duration={duration - 10}
                side="top"
                step="▶"
                title="A modern weather app built with React"
                text="Fast, responsive and beautifully animated. Let's take a tour."
            />

            <AbsoluteFill style={{ perspective: 1800, alignItems: "center", paddingTop: 300 }}>
                <div
                    style={{
                        width: WIN_W,
                        transform: `translateY(${translateY}px) rotateX(${rotateX}deg) scale(${exitZoom})`,
                        transformOrigin: "50% 0%",
                        borderRadius: 22,
                        overflow: "hidden",
                        boxShadow: "0 60px 120px rgba(0,0,0,0.55), 0 0 0 1.5px rgba(255,255,255,0.25)",
                        background: "#0f172a",
                    }}>
                    {/* Browser chrome */}
                    <div
                        style={{
                            height: CHROME_H,
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "0 20px",
                            background: "linear-gradient(180deg, #1e293b, #0f172a)",
                        }}>
                        {["#f87171", "#fbbf24", "#34d399"].map((c) => (
                            <div key={c} style={{ width: 14, height: 14, borderRadius: "50%", background: c }} />
                        ))}
                        <div
                            style={{
                                marginLeft: 24,
                                flex: 1,
                                height: 30,
                                borderRadius: 10,
                                background: "rgba(255,255,255,0.08)",
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                padding: "0 14px",
                                color: "rgba(255,255,255,0.7)",
                                fontSize: 16,
                            }}>
                            <Img src={staticFile("cloud-pin.png")} style={{ width: 18, height: 18, filter: "invert(1)" }} />
                            Weather Dashboard
                        </div>
                    </div>
                    <div style={{ height: VIEW_H, overflow: "hidden" }}>
                        <Img
                            src={staticFile("day.png")}
                            style={{ width: WIN_W, display: "block", transform: `translateY(${-scroll}px)` }}
                        />
                    </div>
                </div>
            </AbsoluteFill>

            {BADGES.map((b) => {
                const s = spring({ frame: frame - b.delay, fps, config: { damping: 13 } });
                const dir = b.side === "left" ? -1 : 1;
                return (
                    <div
                        key={b.label}
                        style={{
                            position: "absolute",
                            top: b.y,
                            [b.side]: 36,
                            padding: "16px 24px",
                            borderRadius: 20,
                            fontSize: 24,
                            fontWeight: 600,
                            color: "white",
                            background: "rgba(15,23,42,0.7)",
                            border: "1.5px solid rgba(103,232,249,0.6)",
                            boxShadow: "0 0 30px rgba(103,232,249,0.3)",
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            opacity: s * (1 - badgesOut),
                            transform: `translateX(${dir * (1 - s + badgesOut) * 200}px) translateY(${
                                Math.sin((frame + b.y) / 18) * 6
                            }px)`,
                        }}>
                        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#fde047" }} />
                        {b.label}
                    </div>
                );
            })}
        </AbsoluteFill>
    );
};
