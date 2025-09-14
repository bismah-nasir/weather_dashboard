import { RiLineChartLine } from "react-icons/ri";
import { RiThermometerLine } from "react-icons/ri";
import { useState, useEffect } from "react";
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

let data = [];

const getNextSevenHourForecast = (forecast, weather) => {
    const currentTime = weather?.dt + weather?.timezone;
    const firstIndex = forecast?.list?.findIndex(
        (item) => item?.dt > currentTime
    );
    return forecast.list.slice(firstIndex, firstIndex + 7);
};

const HourlyChart = ({ weather, forecast, unit }) => {
    const [hourForecast, setHourForecast] = useState([]);
    const [isMobile, setIsMobile] = useState(false);

    const firstHourTime = formatToLocalTime(
        weather?.dt,
        weather?.timezone,
        "HH:mm"
    );

    const hourData = [firstHourTime.slice(0, 3) + "00"];
    const tempData = [Math.round(weather?.main?.temp)];

    useEffect(() => {
        if (!forecast || !weather) return;
        setHourForecast(getNextSevenHourForecast(forecast, weather));
    }, [forecast, weather]);

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

            {hourForecast.map((hour) => {
                tempData.push(Math.round(hour.main.temp));
                hourData.push(hour.dt_txt.split(" ")[1].slice(0, 5));
            })}
            {(() => {
                data = hourData.map((time, index) => ({
                    time,
                    temp: tempData[index],
                }));
            })()}

            {isMobile ? (
                <>
                    {/* Mobile Chart */}
                    <div className="h-80 mt-6 -ml-10 -mr-3">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <CartesianGrid
                                    strokeDasharray="2 2 "
                                    stroke="#ffffff50"
                                />
                                <XAxis dataKey="time" stroke="#fff" fontSize={10} />
                                <YAxis
                                    domain={[(dataMin) => Math.ceil(dataMin - 10), (dataMax) => Math.ceil(dataMax + 10)]}
                                    stroke="#fff"
                                    fontSize={10}
                                    label={{
                                        fontSize: 10,
                                        value: `°${unit === "metric" ? "C" : "F"}`,
                                        angle: -90,
                                        fill: "#fff",
                                    }}
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
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/20">
                        <div className="flex items-center gap-2 text-white/80 text-xs">
                            <div className="w-6 h-6 flex items-center justify-center">
                                <RiThermometerLine className="text-lg"></RiThermometerLine>
                            </div>
                            <span>Temperature in °{unit === "metric" ? "C" : "F"}</span>
                        </div>
                        <div className="text-white/60 text-xs">
                            Next update in 15 minutes
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {/* Desktop Chart */}
                    <div className="h-80 mt-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <CartesianGrid
                                    strokeDasharray="3 3 "
                                    stroke="#ffffff50"
                                />
                                <XAxis dataKey="time" stroke="#fff" />
                                <YAxis
                                    domain={[0, (dataMax) => Math.ceil(dataMax + 10)]}
                                    stroke="#fff"
                                    label={{
                                        value: `°${unit === "metric" ? "C" : "F"}`,
                                        angle: -90,
                                        position: "insideLeft",
                                        fill: "#fff",
                                    }}
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
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/20">
                        <div className="flex items-center gap-2 text-white/80 text-sm">
                            <div className="w-6 h-6 flex items-center justify-center">
                                <RiThermometerLine className="text-lg"></RiThermometerLine>
                            </div>
                            <span>Temperature in °{unit === "metric" ? "C" : "F"}</span>
                        </div>
                        <div className="text-white/60 text-sm">
                            Next update in 15 minutes
                        </div>
                    </div>
                </>
            )}
        </div >
    );
};

export default HourlyChart;
