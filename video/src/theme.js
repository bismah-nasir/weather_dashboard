import { loadFont } from "@remotion/google-fonts/Poppins";

const { fontFamily } = loadFont("normal", {
    weights: ["400", "500", "600", "700", "800"],
    subsets: ["latin"],
});

export const FONT = fontFamily;
export const FPS = 30;
export const DURATION = 900; // 30 seconds
export const WIDTH = 1920;
export const HEIGHT = 1080;

// Screenshot size (public/day.png & night.png)
export const SHOT_W = 1920;
export const SHOT_H = 2201;

export const COLORS = {
    blue: "#2563eb",
    teal: "#0d9488",
    cyan: "#0e7490",
    accent: "#67e8f9",
    yellow: "#fde047",
    white: "#ffffff",
};

// Timeline (frames). Neighbouring scenes overlap slightly for crossfades.
export const SCENES = {
    intro: { from: 0, duration: 105 },
    showcase: { from: 95, duration: 145 },
    tour: { from: 230, duration: 490 },
    dayNight: { from: 710, duration: 105 },
    outro: { from: 805, duration: 95 },
};
