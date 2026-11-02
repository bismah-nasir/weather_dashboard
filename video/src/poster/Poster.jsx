import { AbsoluteFill, Img, staticFile } from "remotion";
import { Logo } from "./Logo";
import { bodyFont, colors, headingFont, links } from "./theme";

const shot = (name) => staticFile(`poster/screenshots/${name}.png`);

function Chip({ children }) {
    return (
        <span
            style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 22px",
                borderRadius: 999,
                background: colors.glass,
                border: `1.5px solid ${colors.glassLine}`,
                color: colors.ink,
                fontSize: 24,
                fontWeight: 600,
            }}
        >
            <span style={{ width: 10, height: 10, borderRadius: 5, background: colors.sun }} />
            {children}
        </span>
    );
}

/** Dark browser window chrome, as in the demo video. */
function BrowserFrame({ width, height, url, children }) {
    return (
        <div
            style={{
                width,
                height,
                borderRadius: 22,
                overflow: "hidden",
                background: colors.chrome,
                border: `1.5px solid ${colors.glassLine}`,
                boxShadow: `0 40px 110px ${colors.shadow}`,
                display: "flex",
                flexDirection: "column",
            }}
        >
            <div
                style={{
                    height: 52,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "0 22px",
                    flexShrink: 0,
                }}
            >
                {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                    <span key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />
                ))}
                <div
                    style={{
                        marginLeft: 18,
                        flex: 1,
                        maxWidth: 620,
                        height: 32,
                        borderRadius: 8,
                        background: "rgba(255,255,255,0.08)",
                        color: colors.muted,
                        fontSize: 17,
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                        padding: "0 16px",
                    }}
                >
                    {url}
                </div>
            </div>
            <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>{children}</div>
        </div>
    );
}

/** Thumbnail shown before the demo video plays. */
export function WeatherPoster() {
    return (
        <AbsoluteFill
            style={{
                background: `linear-gradient(125deg, ${colors.bgFrom} 0%, ${colors.bgVia} 50%, ${colors.bgTo} 100%)`,
                fontFamily: bodyFont,
                color: colors.ink,
            }}
        >
            <AbsoluteFill
                style={{
                    background: `radial-gradient(800px 600px at 18% 30%, rgba(59,130,246,0.35), transparent 70%),
                        radial-gradient(900px 700px at 90% 80%, rgba(20,184,166,0.30), transparent 70%),
                        radial-gradient(500px 400px at 75% 8%, rgba(252,211,77,0.10), transparent 70%)`,
                }}
            />
            {/* Faint dot grid, like the video's backdrop */}
            <AbsoluteFill
                style={{
                    backgroundImage: "radial-gradient(rgba(255,255,255,0.10) 1.5px, transparent 1.5px)",
                    backgroundSize: "44px 44px",
                    maskImage: "linear-gradient(90deg, black, transparent 70%)",
                }}
            />
            <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", padding: "0 0 0 120px" }}>
                <div style={{ width: 780, display: "flex", flexDirection: "column", gap: 34, flexShrink: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
                        <Logo size={110} />
                        <div
                            style={{
                                fontFamily: headingFont,
                                fontSize: 88,
                                fontWeight: 800,
                                letterSpacing: -2,
                                lineHeight: 0.98,
                            }}
                        >
                            Weather
                            <br />
                            Dashboard
                        </div>
                    </div>
                    <div style={{ fontFamily: headingFont, fontSize: 50, fontWeight: 700, lineHeight: 1.15, letterSpacing: -1 }}>
                        Forecasts &amp; <span style={{ color: colors.accent }}>air quality</span> for any city, in real time
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                        <Chip>Hourly forecast</Chip>
                        <Chip>Air quality index</Chip>
                        <Chip>Day / night themes</Chip>
                    </div>
                    <div style={{ fontSize: 26, fontWeight: 500, color: colors.muted }}>{links.live}</div>
                </div>

                <div style={{ position: "relative", flex: 1, height: "100%" }}>
                    <div
                        style={{
                            position: "absolute",
                            left: 30,
                            top: 250,
                            transform: "perspective(2200px) rotateY(-14deg) rotateX(4deg)",
                            transformOrigin: "left center",
                        }}
                    >
                        <BrowserFrame width={1220} height={562} url={links.live}>
                            <Img
                                src={shot("dashboard")}
                                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
                            />
                        </BrowserFrame>
                    </div>
                    {/* Air Quality panel, lifted out of the dashboard as a floating card */}
                    <div
                        style={{
                            position: "absolute",
                            right: 70,
                            top: 520,
                            width: 268,
                            height: 469,
                            borderRadius: 28,
                            overflow: "hidden",
                            border: `2px solid ${colors.accent}`,
                            boxShadow: `0 40px 100px ${colors.shadow}, 0 0 40px rgba(94,230,224,0.25)`,
                        }}
                    >
                        <Img src={shot("air-quality")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
}
