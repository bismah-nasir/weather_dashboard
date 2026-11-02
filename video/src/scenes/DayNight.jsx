import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Caption } from "../components/Caption";
import { sceneOpacity } from "../components/fade";


const CARD_W = 1500;
const CARD_H = 720;
const SKEW = 0.2; // horizontal lean of the wipe edge, as a fraction of card width
const EDGE_ANGLE = (Math.atan((SKEW * CARD_W) / CARD_H) * 180) / Math.PI;
const EDGE_LEN = Math.hypot(SKEW * CARD_W, CARD_H) + 40;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };

const Sun = () => (
    <svg width="64" height="64" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="13" fill="#fde047" />
        {Array.from({ length: 8 }, (_, i) => (
            <line
                key={i}
                x1="32"
                y1="6"
                x2="32"
                y2="13"
                stroke="#fde047"
                strokeWidth="4"
                strokeLinecap="round"
                transform={`rotate(${i * 45} 32 32)`}
            />
        ))}
    </svg>
);

const Moon = () => (
    <svg width="60" height="60" viewBox="0 0 64 64">
        <path d="M42 8a24 24 0 1 0 14 34A20 20 0 0 1 42 8z" fill="#c7d2fe" />
    </svg>
);

export const DayNight = ({ duration }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const enter = spring({ frame, fps, config: { damping: 16 } });
    // Wipe position: -SKEW..1+SKEW so both edges fully clear the card
    const p = interpolate(frame, [22, 62], [-SKEW / 2, 1 + SKEW / 2], {
        ...clamp,
        easing: Easing.inOut(Easing.cubic),
    });
    const topX = (p + SKEW / 2) * 100;
    const bottomX = (p - SKEW / 2) * 100;
    const zoom = interpolate(frame, [0, duration], [1, 1.06]);
    const edgeOpacity = interpolate(frame, [18, 24, 60, 66], [0, 1, 1, 0], clamp);

    const image = (src) => (
        <Img
            src={staticFile(src)}
            style={{
                position: "absolute",
                width: CARD_W,
                top: 0,
                left: 0,
                transform: `scale(${zoom})`,
                transformOrigin: "50% 0%",
            }}
        />
    );

    return (
        <AbsoluteFill style={{ opacity: sceneOpacity(frame, duration, 10, 12) }}>
            <AbsoluteFill style={{ alignItems: "center", paddingTop: 70 }}>
                <div
                    style={{
                        position: "relative",
                        width: CARD_W,
                        height: CARD_H,
                        borderRadius: 32,
                        overflow: "hidden",
                        boxShadow: "0 50px 120px rgba(0,0,0,0.6), 0 0 0 1.5px rgba(255,255,255,0.25)",
                        transform: `translateY(${(1 - enter) * 120}px) scale(${0.9 + enter * 0.1})`,
                    }}>
                    {image("day.png")}
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            clipPath: `polygon(0% 0%, ${topX}% 0%, ${bottomX}% 100%, 0% 100%)`,
                        }}>
                        {image("night.png")}
                    </div>
                    {/* Glowing wipe edge */}
                    <div
                        style={{
                            position: "absolute",
                            left: `${p * 100}%`,
                            top: CARD_H / 2 - EDGE_LEN / 2,
                            width: 6,
                            height: EDGE_LEN,
                            marginLeft: -3,
                            background: "white",
                            boxShadow: "0 0 30px 8px rgba(103,232,249,0.9)",
                            transform: `rotate(${EDGE_ANGLE}deg)`,
                            opacity: edgeOpacity,
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            left: `${p * 100}%`,
                            top: CARD_H / 2 - 36,
                            display: "flex",
                            gap: 18,
                            transform: "translateX(-50%)",
                            opacity: edgeOpacity,
                            padding: "6px 16px",
                            borderRadius: 999,
                            background: "rgba(15,23,42,0.75)",
                            border: "1.5px solid rgba(255,255,255,0.3)",
                        }}>
                        <Moon />
                        <Sun />
                    </div>
                </div>
            </AbsoluteFill>

            <Caption
                frame={frame - 8}
                duration={duration - 8}
                side="bottom"
                step={8}
                title="Dynamic day & night themes"
                text="The background adapts to each city's local sunrise and sunset"
                accent="#a5b4fc"
            />
        </AbsoluteFill>
    );
};
