import { Composition, Still } from "remotion";
import { Video } from "./Video";
import { WeatherPoster } from "./poster/Poster";
import { FPS, DURATION, WIDTH, HEIGHT } from "./theme";

export const RemotionRoot = () => (
    <>
        <Composition
            id="WeatherDashboardDemo"
            component={Video}
            durationInFrames={DURATION}
            fps={FPS}
            width={WIDTH}
            height={HEIGHT}
        />
        <Still id="WeatherPoster" component={WeatherPoster} width={WIDTH} height={HEIGHT} />
    </>
);
