import { DateTime } from "luxon";

// Function to get icon png
export const iconUrlFromCode = (icon) =>
    `http://openweathermap.org/img/wn/${icon}@2x.png`;

// Function to convert time in specified format
export const formatToLocalTime = (secs, offset, format = "cccc, LLLL dd'") => {
    if (!secs || !offset) return "";
    return DateTime.fromSeconds(secs + offset, { zone: "utc" }).toFormat(
        format
    );
};

// Function to get difference in time
export const timeDifference = (fromSecs, toSecs) => {
    if (!fromSecs || !toSecs) return "";

    const from = DateTime.fromSeconds(fromSecs, { zone: "utc" });
    const to = DateTime.fromSeconds(toSecs, { zone: "utc" });

    if (!from.isValid || !to.isValid) return "Invalid Time";

    const diff = to.diff(from, ["minutes"]); // difference in hours + minutes
    const hours = Math.floor(diff.hours);
    const minutes = Math.floor(diff.minutes);

    return `${hours}h ${minutes}m`;
};

// Function to get difference in "xh ym" format
export const formatTimeDifference = (fromSecs, toSecs) => {
    if (!fromSecs || !toSecs) return "";

    const from = DateTime.fromSeconds(fromSecs, { zone: "utc" });
    const to = DateTime.fromSeconds(toSecs, { zone: "utc" });

    if (!from.isValid || !to.isValid) return "Invalid Time";

    const diff = to.diff(from, ["hours", "minutes"]); // difference in hours + minutes
    const hours = Math.floor(diff.hours);
    const minutes = Math.floor(diff.minutes);

    return `${hours}h ${minutes}m`;
};

// Function to convert wind speed in km/h
export function convertWindSpeed(speed, units) {
    let kmh = 0;

    switch (units) {
        case "metric": // m/s → km/h
        case "standard": // default
            kmh = speed * 3.6;
            break;
        case "imperial": // mph → km/h
            kmh = speed * 1.60934;
            break;
        default:
            throw new Error(
                "Invalid units type. Use 'metric', 'imperial', or 'standard'."
            );
    }

    return kmh.toFixed(0);
}

// Function to process the 5 days temperature
export const processForecastData = (list) => {
    // Group data by date (YYYY-MM-DD)
    const days = {};

    if (!list) {
        return;
    }

    list.forEach((entry) => {
        const date = DateTime.fromSeconds(entry.dt).toFormat("yyyy-MM-dd");

        if (!days[date]) {
            days[date] = {
                date,
                temps: [],
                humidities: [],
                descriptions: [],
                icons: [],
            };
        }

        days[date].temps.push(entry.main.temp);
        days[date].humidities.push(entry.main.humidity);
        days[date].descriptions.push(entry.weather[0].description);
        days[date].icons.push(entry.weather[0].icon);
    });

    // Convert grouped data to daily summary
    const dailySummaries = Object.values(days)
        .slice(0, 5)
        .map((day, index) => {
            const avgHumidity =
                day.humidities.reduce((a, b) => a + b, 0) /
                day.humidities.length;

            const highTemp = Math.max(...day.temps);
            const lowTemp = Math.min(...day.temps);

            const description =
                day.descriptions[Math.floor(day.descriptions.length / 2)];

            const icon = day.icons[Math.floor(day.icons.length / 2)];

            let label;
            if (index === 0) label = "Today";
            else if (index === 1) label = "Tomorrow";
            else label = DateTime.fromISO(day.date).toFormat("cccc");

            return {
                label,
                description,
                icon,
                avgHumidity: Math.round(avgHumidity),
                highTemp: Math.round(highTemp),
                lowTemp: Math.round(lowTemp),
            };
        });

    // Collect all temperatures across the 5 days
    const allTemps = dailySummaries.flatMap((day) => [
        day.highTemp,
        day.lowTemp,
    ]);

    // Calculate overall highest & lowest temp of the week
    const weekHighTemp = Math.max(...allTemps);
    const weekLowTemp = Math.min(...allTemps);

    return {
        dailySummaries,
        weekHighTemp,
        weekLowTemp,
    };
};
