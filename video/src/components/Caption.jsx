import { interpolate, spring, useVideoConfig } from "remotion";

const OFFSET = {
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
    top: { x: 0, y: -1 },
    bottom: { x: 0, y: 1 },
};

const POSITION = {
    left: { left: 80, top: "50%", width: 520, translateY: "-50%" },
    right: { right: 80, top: "50%", width: 520, translateY: "-50%" },
    top: { left: "50%", top: 60, width: 1100, translateX: "-50%" },
    bottom: { left: "50%", bottom: 70, width: 1100, translateX: "-50%" },
};

/**
 * Glass caption card that slides in from `side`, staggers its title words
 * and slides back out. `frame` is local to the caption (0 = start of entry).
 */
export const Caption = ({ frame, duration, side = "left", step, title, text, accent = "#67e8f9" }) => {
    const { fps } = useVideoConfig();
    const enter = spring({ frame, fps, config: { damping: 16, stiffness: 120 } });
    const exit = interpolate(frame, [duration - 12, duration], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const progress = enter - exit;
    const dist = 260;
    const { x, y } = OFFSET[side];
    const pos = POSITION[side];
    const isVertical = side === "left" || side === "right";
    const words = title.split(" ");

    return (
        <div
            style={{
                position: "absolute",
                left: pos.left,
                right: pos.right,
                top: pos.top,
                bottom: pos.bottom,
                width: pos.width,
                transform: `translate(${pos.translateX ?? "0px"}, ${pos.translateY ?? "0px"}) translate(${
                    x * dist * (1 - progress)
                }px, ${y * dist * (1 - progress)}px)`,
                opacity: Math.max(0, Math.min(1, progress * 1.4)),
                filter: `blur(${(1 - Math.min(1, progress)) * 8}px)`,
            }}>
            <div
                style={{
                    position: "relative",
                    padding: isVertical ? "40px 44px" : "28px 44px",
                    borderRadius: 32,
                    background: "linear-gradient(135deg, rgba(10,17,35,0.96), rgba(15,23,42,0.9))",
                    border: "1.5px solid rgba(255,255,255,0.22)",
                    boxShadow: `0 30px 80px rgba(0,0,0,0.45), 0 0 40px ${accent}33`,
                    backdropFilter: "blur(16px)",
                    display: "flex",
                    flexDirection: isVertical ? "column" : "row",
                    alignItems: isVertical ? "flex-start" : "center",
                    gap: isVertical ? 18 : 30,
                    overflow: "hidden",
                }}>
                {/* Accent bar that grows in */}
                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        height: isVertical ? `${enter * 100}%` : 6,
                        width: isVertical ? 6 : `${enter * 100}%`,
                        background: `linear-gradient(${isVertical ? 180 : 90}deg, ${accent}, #fde047)`,
                    }}
                />
                <div
                    style={{
                        flexShrink: 0,
                        width: 74,
                        height: 74,
                        borderRadius: 22,
                        background: `${accent}22`,
                        border: `2px solid ${accent}`,
                        color: accent,
                        fontSize: 30,
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transform: `scale(${spring({ frame: frame - 4, fps, config: { damping: 10 } })})`,
                    }}>
                    {typeof step === "number" ? String(step).padStart(2, "0") : step}
                </div>
                <div>
                    <div
                        style={{
                            fontSize: isVertical ? 46 : 44,
                            fontWeight: 700,
                            color: "white",
                            lineHeight: 1.15,
                            display: "flex",
                            flexWrap: "wrap",
                            columnGap: 14,
                        }}>
                        {words.map((w, i) => {
                            const s = spring({ frame: frame - 6 - i * 3, fps, config: { damping: 14 } });
                            return (
                                <span
                                    key={i}
                                    style={{
                                        display: "inline-block",
                                        opacity: s,
                                        transform: `translateY(${(1 - s) * 30}px)`,
                                    }}>
                                    {w}
                                </span>
                            );
                        })}
                    </div>
                    <div
                        style={{
                            marginTop: 12,
                            fontSize: 26,
                            lineHeight: 1.45,
                            color: "rgba(255,255,255,0.78)",
                            opacity: interpolate(frame, [14, 26], [0, 1], {
                                extrapolateLeft: "clamp",
                                extrapolateRight: "clamp",
                            }),
                        }}>
                        {text}
                    </div>
                </div>
            </div>
        </div>
    );
};
