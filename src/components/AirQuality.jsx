import { useEffect, useState } from "react";
import { RiLeafLine, RiInformationLine } from "react-icons/ri";

//Global AQI Index
const AQI_MAP = {
    1: {
        label: "Good",
        classes: {
            text: "text-green-300",
            bg: "bg-green-500/20",
            dot: "bg-green-500",
        },
        advice: "Air quality is considered satisfactory, and air pollution poses little or no risk.",
    },
    2: {
        label: "Fair",
        classes: {
            text: "text-blue-300",
            bg: "bg-blue-500/20",
            dot: "bg-blue-500",
        },
        advice: "Air quality is acceptable; however, for some pollutants there may be a moderate health concern.",
    },
    3: {
        label: "Moderate",
        classes: {
            text: "text-yellow-300",
            bg: "bg-yellow-500/20",
            dot: "bg-yellow-500",
        },
        advice: "Members of sensitive groups may experience health effects. General public is less likely to be affected.",
    },
    4: {
        label: "Poor",
        classes: {
            text: "text-orange-300",
            bg: "bg-orange-500/20",
            dot: "bg-orange-500",
        },
        advice: "Everyone may begin to experience health effects; members of sensitive groups may experience more serious effects.",
    },
    5: {
        label: "Very Poor",
        classes: {
            text: "text-red-300",
            bg: "bg-red-500/20",
            dot: "bg-red-500",
        },
        advice: "Health alert: everyone may experience more serious health effects.",
    },
};

// Pollutant-specific thresholds
const POLLUTANT_THRESHOLDS = {
    pm2_5: [
        {
            max: 12,
            label: "Good",
            classes: { text: "text-green-300", bg: "bg-green-500/20" },
        },
        {
            max: 35.4,
            label: "Moderate",
            classes: { text: "text-yellow-300", bg: "bg-yellow-500/20" },
        },
        {
            max: 55.4,
            label: "Unhealthy SG",
            classes: { text: "text-orange-300", bg: "bg-orange-500/20" },
        },
        {
            max: 150.4,
            label: "Unhealthy",
            classes: { text: "text-red-300", bg: "bg-red-500/20" },
        },
        {
            max: 250.4,
            label: "Very Unhealthy",
            classes: { text: "text-purple-300", bg: "bg-purple-500/20" },
        },
        {
            max: Infinity,
            label: "Hazardous",
            classes: { text: "text-pink-300", bg: "bg-pink-500/20" },
        },
    ],
    pm10: [
        {
            max: 54,
            label: "Good",
            classes: { text: "text-green-300", bg: "bg-green-500/20" },
        },
        {
            max: 154,
            label: "Moderate",
            classes: { text: "text-yellow-300", bg: "bg-yellow-500/20" },
        },
        {
            max: 254,
            label: "Unhealthy SG",
            classes: { text: "text-orange-300", bg: "bg-orange-500/20" },
        },
        {
            max: 354,
            label: "Unhealthy",
            classes: { text: "text-red-300", bg: "bg-red-500/20" },
        },
        {
            max: 424,
            label: "Very Unhealthy",
            classes: { text: "text-purple-300", bg: "bg-purple-500/20" },
        },
        {
            max: Infinity,
            label: "Hazardous",
            classes: { text: "text-pink-300", bg: "bg-pink-500/20" },
        },
    ],
    o3: [
        {
            max: 0.054,
            label: "Good",
            classes: { text: "text-green-300", bg: "bg-green-500/20" },
        },
        {
            max: 0.07,
            label: "Moderate",
            classes: { text: "text-yellow-300", bg: "bg-yellow-500/20" },
        },
        {
            max: 0.085,
            label: "Unhealthy SG",
            classes: { text: "text-orange-300", bg: "bg-orange-500/20" },
        },
        {
            max: 0.105,
            label: "Unhealthy",
            classes: { text: "text-red-300", bg: "bg-red-500/20" },
        },
        {
            max: 0.2,
            label: "Very Unhealthy",
            classes: { text: "text-purple-300", bg: "bg-purple-500/20" },
        },
        {
            max: Infinity,
            label: "Hazardous",
            classes: { text: "text-pink-300", bg: "bg-pink-500/20" },
        },
    ],
    no2: [
        {
            max: 53,
            label: "Good",
            classes: { text: "text-green-300", bg: "bg-green-500/20" },
        },
        {
            max: 100,
            label: "Moderate",
            classes: { text: "text-yellow-300", bg: "bg-yellow-500/20" },
        },
        {
            max: 360,
            label: "Unhealthy SG",
            classes: { text: "text-orange-300", bg: "bg-orange-500/20" },
        },
        {
            max: 649,
            label: "Unhealthy",
            classes: { text: "text-red-300", bg: "bg-red-500/20" },
        },
        {
            max: 1249,
            label: "Very Unhealthy",
            classes: { text: "text-purple-300", bg: "bg-purple-500/20" },
        },
        {
            max: Infinity,
            label: "Hazardous",
            classes: { text: "text-pink-300", bg: "bg-pink-500/20" },
        },
    ],
};

const getPollutantStatus = (pollutant, value) => {
    const rules = POLLUTANT_THRESHOLDS[pollutant];
    if (!rules)
        return {
            label: "N/A",
            classes: { text: "text-gray-300", bg: "bg-gray-500/20" },
        };
    return rules.find((r) => value <= r.max);
};

const AirQuality = ({ weather }) => {
    const lat = weather?.coord?.lat;
    const lon = weather?.coord?.lon;

    const [airData, setAirData] = useState(null);

    useEffect(() => {
        if (!lat || !lon) return;

        const fetchAir = async () => {
            const API_KEY = import.meta.env.VITE_APP_ID;
            const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

            try {
                const res = await fetch(url);
                if (!res.ok) throw new Error("Failed to fetch air quality");

                const data = await res.json();
                console.log("Air API Response:", data);
                setAirData(data.list[0]); // only one item
            } catch (err) {
                console.error("Air API error:", err);
            }
        };

        fetchAir();
    }, [lat, lon]);

    if (!airData) {
        return <div className="text-white/70">Loading air quality data...</div>;
    }

    const aqi = airData.main.aqi;
    const { label, classes, advice } = AQI_MAP[aqi];
    const comps = airData.components;

    // For the circular progress stroke
    const strokePercent = (aqi / 5) * 100;

    return (
        <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-6 border border-white/30 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-6 h-6 flex items-center justify-center">
                    <RiLeafLine className="text-2xl text-green-300" />
                </div>
                Air Quality
            </h3>

            {/* AQI Circle */}
            <div className="text-center mb-6">
                <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg
                        className="w-32 h-32 transform -rotate-90"
                        viewBox="0 0 36 36">
                        <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="rgba(255,255,255,0.2)"
                            strokeWidth="3"
                        />
                        <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeDasharray={`${strokePercent}, 100`}
                            className={classes.text}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-3xl font-bold text-white">
                            {aqi}
                        </div>
                        <div className="text-xs text-white/80">AQI</div>
                    </div>
                </div>
                <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${classes.bg} ${classes.text} border border-current/30`}>
                    <div className={`w-2 h-2 rounded-full ${classes.dot}`} />
                    <span className="text-sm font-medium">{label}</span>
                </div>
                <p className="text-white/70 text-sm mt-2">
                    {label} air quality
                </p>
            </div>

            {/* Pollutants */}
            <div className="space-y-3">
                <h4 className="text-white/90 font-semibold text-sm mb-3">
                    Main Pollutants
                </h4>
                {[
                    { key: "pm2_5", name: "PM2.5", value: comps.pm2_5 },
                    { key: "pm10", name: "PM10", value: comps.pm10 },
                    { key: "o3", name: "O₃", value: comps.o3 },
                    { key: "no2", name: "NO₂", value: comps.no2 },
                ].map((p, i) => {
                    const status = getPollutantStatus(p.key, p.value);
                    return (
                        <div
                            key={i}
                            className="flex items-center justify-between p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                            <div className="flex items-center gap-3">
                                <div className="text-white font-medium text-sm">
                                    {p.name}
                                </div>
                                <div
                                    className={`text-xs px-2 py-1 rounded-full ${status.classes.bg} ${status.classes.text}`}>
                                    {status.label}
                                </div>
                            </div>
                            <div className="text-white/80 text-sm">
                                {p.value.toFixed(1)} μg/m³
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Health Advice */}
            <div className="mt-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                <div className="flex items-start gap-3">
                    <div className="w-5 h-5 flex items-center justify-center mt-0.5">
                        <RiInformationLine className="text-lg text-blue-300" />
                    </div>
                    <div>
                        <div className="text-white/90 text-sm font-medium mb-1">
                            Health Advice
                        </div>
                        <div className="text-white/70 text-xs">{advice}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AirQuality;
