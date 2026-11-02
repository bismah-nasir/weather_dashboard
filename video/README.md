# Weather Dashboard demo video

A 1920×1080 demo video of the Weather Dashboard, plus a poster (thumbnail) image, built with [Remotion](https://www.remotion.dev).

The rendered files are committed, so you can watch them without installing anything:

- Video: [`out/weather-dashboard-demo.mp4`](out/weather-dashboard-demo.mp4)
- Poster: [`out/poster.jpg`](out/poster.jpg)

## Commands

```bash
cd video
npm install
npm run studio   # preview and scrub in Remotion Studio
npm run render   # writes out/weather-dashboard-demo.mp4
npm run poster   # writes out/poster.jpg
npm run music    # regenerate public/music.wav
```

If another dev server already uses port 3000, add a free port, e.g. `npm run poster -- --port=3123`.

## Layout

```text
src/
  index.js         registerRoot
  Root.jsx         the WeatherDashboardDemo composition and the WeatherPoster still
  Video.jsx        scene order and durations
  theme.js         size, frame rate, colours and fonts
  scenes/          Intro, Tour, DayNight, Showcase, Outro
  components/      background, captions, cursor, logo, progress bar
  poster/          Poster.jsx, Logo.jsx and theme.js for the poster
public/            day/night screenshots, logo pin and music used by the video
public/poster/     screenshots used by the poster
scripts/           generate-music.mjs synthesises the soundtrack
```

This folder is a separate npm package. The app's ESLint config ignores it.
