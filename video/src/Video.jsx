import { AbsoluteFill, Audio, Sequence, staticFile, interpolate, useCurrentFrame } from "remotion";
import { Background } from "./components/Background";
import { ProgressBar } from "./components/ProgressBar";
import { Intro } from "./scenes/Intro";
import { Showcase } from "./scenes/Showcase";
import { Tour } from "./scenes/Tour";
import { DayNight } from "./scenes/DayNight";
import { Outro } from "./scenes/Outro";
import { DURATION, FONT, SCENES } from "./theme";

const scenes = [
    ["intro", Intro],
    ["showcase", Showcase],
    ["tour", Tour],
    ["dayNight", DayNight],
    ["outro", Outro],
];

export const Video = () => {
    const frame = useCurrentFrame();
    const volume = interpolate(frame, [0, 10, DURATION - 60, DURATION], [0, 0.85, 0.85, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    return (
        <AbsoluteFill style={{ fontFamily: FONT, backgroundColor: "#020617" }}>
            <Background />
            {scenes.map(([key, Scene]) => (
                <Sequence
                    key={key}
                    from={SCENES[key].from}
                    durationInFrames={SCENES[key].duration}
                    name={key}>
                    <Scene duration={SCENES[key].duration} />
                </Sequence>
            ))}
            <ProgressBar />
            <Audio src={staticFile("music.wav")} volume={volume} />
        </AbsoluteFill>
    );
};
