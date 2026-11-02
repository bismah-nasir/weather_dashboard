import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Caption } from "../components/Caption";
import { Cursor } from "../components/Cursor";
import { sceneOpacity } from "../components/fade";
import { HEIGHT, SHOT_H, SHOT_W, WIDTH } from "../theme";

const SHOT_LEN = 70;
const MOVE = 24; // frames the camera spends travelling to the next card

// Card rectangles in day.png pixel coordinates
const SHOTS = [
    {
        rect: [180, 118, 1562, 66],
        side: "top",
        anchorY: 420,
        title: "Search any city worldwide",
        text: "Instant lookup powered by the OpenWeather API, with a one-tap °C / °F switch",
        cursor: {
            path: [
                [18, 1500, 1300],
                [36, 470, 151],
                [48, 470, 151],
                [58, 1705, 151],
            ],
            clicks: [38, 60],
        },
    },
    {
        rect: [180, 222, 1029, 471],
        side: "right",
        title: "Live conditions at a glance",
        text: "Temperature, feels-like, humidity, wind speed and today's high & low",
    },
    {
        rect: [1241, 222, 497, 526],
        side: "left",
        title: "Sunrise, sunset & local time",
        text: "Countdown to sunset with automatic day / night detection",
    },
    {
        rect: [180, 724, 1029, 596],
        side: "bottom",
        title: "24-hour temperature trend",
        text: "Interactive Recharts line graph in 3-hour steps",
    },
    {
        rect: [1241, 779, 497, 871],
        side: "left",
        title: "Air quality index",
        text: "AQI score, PM2.5, PM10, O₃ & NO₂ levels plus health advice",
    },
    {
        rect: [180, 1353, 1029, 797],
        side: "right",
        title: "5-day forecast",
        text: "Daily conditions, humidity, highs and lows for the week ahead",
    },
    {
        rect: [1241, 1683, 497, 484],
        side: "left",
        title: "Favourite cities",
        text: "Save cities with a heart and jump back in one click, stored in localStorage",
        cursor: {
            path: [
                [20, 1900, 2400],
                [38, 1430, 1927],
                [50, 1430, 1927],
                [62, 1430, 1822],
            ],
            clicks: [40],
        },
    },
];

// Free screen area left over once the caption takes its side
const REGIONS = {
    left: [640, 0, WIDTH - 640, HEIGHT],
    right: [0, 0, WIDTH - 640, HEIGHT],
    top: [0, 260, WIDTH, HEIGHT - 260],
    bottom: [0, 0, WIDTH, HEIGHT - 300],
};

// Camera = screenshot point (px, py) placed at screen point (rx, ry) with scale s
const cameraFor = ({ rect: [x, y, w, h], side, anchorY }) => {
    const [rx, ry, rw, rh] = REGIONS[side];
    const s = Math.min((rw * 0.86) / w, (rh * 0.84) / h, 1.35);
    return { s, px: x + w / 2, py: y + h / 2, rx: rx + rw / 2, ry: anchorY ?? ry + rh / 2 };
};

const OVERVIEW = {
    s: (HEIGHT * 0.94) / SHOT_H,
    px: SHOT_W / 2,
    py: SHOT_H / 2,
    rx: WIDTH / 2,
    ry: HEIGHT / 2,
};

const lerp = (a, b, t) => a + (b - a) * t;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };

const interpPath = (path, f) => {
    const frames = path.map((p) => p[0]);
    return [
        interpolate(f, frames, path.map((p) => p[1]), { ...clamp, easing: Easing.inOut(Easing.quad) }),
        interpolate(f, frames, path.map((p) => p[2]), { ...clamp, easing: Easing.inOut(Easing.quad) }),
    ];
};

export const Tour = ({ duration }) => {
    const frame = useCurrentFrame();
    const index = Math.min(SHOTS.length - 1, Math.floor(frame / SHOT_LEN));
    const local = frame - index * SHOT_LEN;
    const shot = SHOTS[index];

    const from = index === 0 ? OVERVIEW : cameraFor(SHOTS[index - 1]);
    const to = cameraFor(shot);
    const t = interpolate(local, [0, MOVE], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
    const arc = Math.sin(Math.PI * t); // pull back mid-flight for a swooping move

    const s = Math.exp(lerp(Math.log(from.s), Math.log(to.s), t)) * (1 - 0.14 * arc);
    const px = lerp(from.px, to.px, t);
    const py = lerp(from.py, to.py, t);
    const rx = lerp(from.rx, to.rx, t);
    const ry = lerp(from.ry, to.ry, t);
    const tx = rx - px * s;
    const ty = ry - py * s;

    // Slight 3D tilt in the direction of travel
    const tiltY = Math.sign(to.px - from.px) * 6 * arc;
    const tiltX = -Math.sign(to.py - from.py) * 5 * arc;

    // Highlight box follows the camera between cards
    const prevRect = index === 0 ? [0, 0, SHOT_W, SHOT_H] : SHOTS[index - 1].rect;
    const [hx, hy, hw, hh] = shot.rect.map((v, i) => lerp(prevRect[i], v, t));
    const highlight = interpolate(local, [MOVE - 6, MOVE + 4], [0, 1], clamp) *
        interpolate(local, [SHOT_LEN - 8, SHOT_LEN], [1, index === SHOTS.length - 1 ? 1 : 0.4], clamp);
    const pulse = 0.6 + 0.4 * Math.sin(frame / 6);
    const pad = 10;

    let cursor = null;
    if (shot.cursor) {
        const { path, clicks } = shot.cursor;
        const [cx, cy] = interpPath(path, local);
        const lastClick = [...clicks].reverse().find((c) => local >= c);
        cursor = {
            x: tx + cx * s,
            y: ty + cy * s,
            opacity: interpolate(local, [path[0][0], path[0][0] + 6, SHOT_LEN - 6, SHOT_LEN], [0, 1, 1, 0], clamp),
            clickAge: lastClick != null ? local - lastClick : null,
        };
    }

    return (
        <AbsoluteFill style={{ opacity: sceneOpacity(frame, duration, 10, 10), perspective: 2200 }}>
            <AbsoluteFill style={{ transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)` }}>
                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: SHOT_W,
                        height: SHOT_H,
                        transformOrigin: "0 0",
                        transform: `translate(${tx}px, ${ty}px) scale(${s})`,
                    }}>
                    <Img
                        src={staticFile("day.png")}
                        style={{
                            width: SHOT_W,
                            height: SHOT_H,
                            borderRadius: 40,
                            boxShadow: "0 40px 140px rgba(0,0,0,0.6)",
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            left: hx - pad,
                            top: hy - pad,
                            width: hw + pad * 2,
                            height: hh + pad * 2,
                            borderRadius: 36,
                            border: `${4 / s}px solid rgba(103,232,249,${highlight})`,
                            boxShadow: `0 0 0 6000px rgba(2,6,23,${0.55 * highlight}), 0 0 ${
                                50 * pulse
                            }px rgba(103,232,249,${0.7 * highlight})`,
                        }}
                    />
                </div>
            </AbsoluteFill>

            {cursor && <Cursor {...cursor} />}

            <Caption
                key={index}
                frame={local - MOVE + 6}
                duration={SHOT_LEN - MOVE + 6}
                side={shot.side}
                step={index + 1}
                title={shot.title}
                text={shot.text}
            />
        </AbsoluteFill>
    );
};
