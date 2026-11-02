import { Img, staticFile } from "remotion";

// The app favicon (black line icon) rendered white inside a glass badge
export const Logo = ({ size = 160, glow = 1 }) => (
    <div
        style={{
            width: size,
            height: size,
            borderRadius: size * 0.3,
            background: "rgba(255,255,255,0.16)",
            border: "2px solid rgba(255,255,255,0.35)",
            backdropFilter: "blur(10px)",
            boxShadow: `0 0 ${60 * glow}px rgba(103,232,249,${0.55 * glow}), inset 0 0 30px rgba(255,255,255,0.15)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}>
        <Img
            src={staticFile("cloud-pin.png")}
            style={{ width: size * 0.66, height: size * 0.66, filter: "invert(1)" }}
        />
    </div>
);
