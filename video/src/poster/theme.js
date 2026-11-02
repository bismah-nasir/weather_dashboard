import { loadFont as loadPoppins } from "@remotion/google-fonts/Poppins";

// Poppins, as in the demo video's titles and captions.
export const { fontFamily: headingFont } = loadPoppins("normal", {
    weights: ["500", "600", "700", "800"],
    subsets: ["latin"],
});

export const bodyFont = headingFont;

// Sampled from the app's daytime gradient and the demo video's backdrop.
export const colors = {
    bgFrom: "#123a8c",
    bgVia: "#0e5f8a",
    bgTo: "#0b6e68",
    appFrom: "#1a73e8",
    appTo: "#0fa596",
    accent: "#5ee6e0",
    sun: "#fcd34d",
    ink: "#ffffff",
    muted: "rgba(226,242,255,0.78)",
    glass: "rgba(255,255,255,0.12)",
    glassLine: "rgba(255,255,255,0.22)",
    chrome: "#0f172a",
    shadow: "rgba(3,14,40,0.45)",
};

export const links = {
    live: "weatherly-dashboard.vercel.app",
    github: "github.com/bismah-nasir/weather_dashboard",
};
