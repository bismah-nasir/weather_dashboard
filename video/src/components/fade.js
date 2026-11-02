import { interpolate } from "remotion";

// Opacity for a scene that fades in over `inF` frames and out over `outF` frames
export const sceneOpacity = (frame, duration, inF = 10, outF = 10) =>
    interpolate(frame, [0, inF, duration - outF, duration], [0, 1, 1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
