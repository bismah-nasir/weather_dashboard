import { interpolate, useCurrentFrame } from "remotion";
import { DURATION } from "../theme";

export const ProgressBar = () => {
    const frame = useCurrentFrame();
    const progress = interpolate(frame, [0, DURATION - 1], [0, 100]);
    return (
        <div
            style={{
                position: "absolute",
                left: 0,
                bottom: 0,
                height: 5,
                width: `${progress}%`,
                background: "linear-gradient(90deg, #67e8f9, #fde047)",
                boxShadow: "0 0 12px rgba(103,232,249,0.8)",
            }}
        />
    );
};
