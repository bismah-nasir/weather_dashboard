import { RiLineChartLine } from "react-icons/ri";
import { RiThermometerLine } from "react-icons/ri";
import { useState, useEffect, useMemo } from "react";
import { formatToLocalTime } from "../utils/utils";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

// 8 forecast points, 3 hours apart, cover the next 24 hours
const FORECAST_POINTS = 8;

const getNext24HourForecast = (forecast, weather) => {
    // Both dt values are UTC, so compare them directly
    const firstIndex = forecast.list.findIndex((item) => item.dt > weather.dt);
    if (firstIndex === -1) return [];
    return forecast.list.slice(firstIndex, firstIndex + FORECAST_POINTS);
};

const HourlyChart = ({ weather, forecast, unit }) => {
    const [isMobile, setIsMobile] = useState(false);

    const data = useMemo(() => {
        if (!forecast?.list || !weather) return [];

        const current = {
            time: formatToLocalTime(weather.dt, weather.timezone, "HH:mm"),
            temp: Math.round(weather.main.temp),
        };

        const upcoming = getNext24HourForecast(forecast, weather).map(
            (hour) => ({
                time: formatToLocalTime(hour.dt, weather.timezone, "HH:mm"),
                temp: Math.round(hour.main.temp),
            })
        );

        return [current, ...upcoming];
    }, [forecast, weather]);

    const updatedAt = formatToLocalTime(weather?.dt, weather?.timezone, "HH:mm");

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 640); // sm breakpoint
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    return (
        <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-6 border border-white/30 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-6 h-6 flex items-center justify-center">
                    <RiLineChartLine
                        className="text-2xl text-green-300"
                        style={{ strokeWidth: 1 }}></RiLineChartLine>
                </div>
                24-Hour Temperature Trend
            </h3>

            <div className="h-80 mt-6">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid
                            strokeDasharray={isMobile ? "2 2" : "3 3"}
                            stroke="#ffffff50"
                        />
                        <XAxis
                            dataKey="time"
                            stroke="#fff"
                            fontSize={isMobile ? 10 : undefined}
                            tickMargin={8}
                            padding={{ left: 12, right: 12 }}
                        />
                        <YAxis
                            domain={[(dataMin) => Math.floor(dataMin - 10), (dataMax) => Math.ceil(dataMax + 10)]}
                            stroke="#fff"
                            fontSize={isMobile ? 10 : undefined}
                            width={isMobile ? 32 : 44}
                            tickFormatter={(value) => `${value}°`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#2563eb",
                                border: "none",
                                borderRadius: "10px",
                                color: "white",
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="temp"
                            stroke="#93c5fd"
                            strokeWidth={3}
                            dot={{ r: 5, fill: "#93c5fd" }}
                            activeDot={{ r: 7 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/20 text-xs sm:text-sm">
                <div className="flex items-center gap-2 text-white/80">
                    <div className="w-6 h-6 flex items-center justify-center">
                        <RiThermometerLine className="text-lg"></RiThermometerLine>
                    </div>
                    <span>Temperature in °{unit === "metric" ? "C" : "F"}</span>
                </div>
                <div className="text-white/60">Updated at {updatedAt}</div>
            </div>
        </div>
    );
};

export default HourlyChart;
