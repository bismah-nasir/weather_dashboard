import { RiCalendarLine } from "react-icons/ri";
import { RiDropLine } from "react-icons/ri";
import { iconUrlFromCode, processForecastData } from "../utils/utils";

const Forecast = ({ forecast, unit }) => {
    const dailyForecast = processForecastData(forecast?.list);

    if (!dailyForecast) {
        return <p>Loading forecast...</p>;
    }
    return (
        <div class="bg-white/20 backdrop-blur-sm rounded-3xl p-6 border border-white/30 shadow-xl">
            <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <div class="w-6 h-6 flex items-center justify-center">
                    <RiCalendarLine
                        class="ri-calendar-line text-2xl text-blue-300"
                        style={{ strokeWidth: 1 }}></RiCalendarLine>
                </div>
                5-Day Forecast
            </h3>

            {console.log("5-Day Forecast")}
            {console.log(dailyForecast)}

            <div className="space-y-4">
                {dailyForecast.dailySummaries.map((summary, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-white/10 rounded-2xl backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
                        {/* Mobile: Left - Weather Icon */}
                        <div class="w-12 h-12 flex items-center justify-center flex-shrink-0 sm:hidden">
                            <img src={iconUrlFromCode(summary.icon)} className="w-10 h-10"></img>
                        </div>
                        
                        {/* Mobile: Middle - Label and Description */}
                        <div class="flex-1 min-w-0 sm:hidden">
                            <div class="text-white font-semibold text-base truncate">
                                {summary.label}
                            </div>
                            <div class="text-white/70 text-xs capitalize truncate">
                                {summary.description}
                            </div>
                        </div>
                        
                        {/* Mobile: Right - Humidity and Temperatures */}
                        <div class="flex flex-col items-end flex-shrink-0 sm:hidden">
                            <div class="flex items-center gap-1 mb-1">
                                <div class="w-3 h-3 flex items-center justify-center">
                                    <RiDropLine
                                        class="text-xs text-blue-300"
                                        style={{ strokeWidth: 1 }}></RiDropLine>
                                </div>
                                <span class="text-white/80 text-xs">
                                    {summary.avgHumidity}%
                                </span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="text-white font-bold text-sm">
                                    {summary.highTemp}°
                                </span>
                                <span class="text-white/60 text-sm">
                                    {summary.lowTemp}°
                                </span>
                            </div>
                        </div>

                        {/* Desktop: Original Layout */}
                        <div class="hidden sm:flex items-center gap-4 flex-1">
                            <div class="w-12 h-12 flex items-center justify-center">
                                <img src={iconUrlFromCode(summary.icon)}></img>
                                <i class="ri-cloudy-2-line text-3xl text-white"></i>
                            </div>
                            <div class="flex-1">
                                <div class="text-white font-semibold text-lg">
                                    {summary.label}
                                </div>
                                <div class="text-white/70 text-sm capitalize">
                                    {summary.description}
                                </div>
                            </div>
                        </div>
                        <div class="hidden sm:block text-center mx-4">
                            <div class="flex items-center gap-2">
                                <div class="w-4 h-4 flex items-center justify-center">
                                    <RiDropLine
                                        class="text-sm text-blue-300"
                                        style={{ strokeWidth: 1 }}></RiDropLine>
                                </div>
                                <span class="text-white/80 text-sm">
                                    {summary.avgHumidity}%
                                </span>
                            </div>
                        </div>
                        <div class="hidden sm:block text-right">
                            <div class="flex items-center gap-3">
                                <span class="text-white font-bold text-lg">
                                    {summary.highTemp}°
                                </span>
                                <span class="text-white/60 text-lg">
                                    {summary.lowTemp}°
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-6 p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-white/80">This Week</span>
                    <div className="flex items-center gap-4 text-white">
                        <span>
                            High: {dailyForecast.weekHighTemp}°
                            {unit === "metric" ? "C" : "F"}
                        </span>
                        <span>
                            Low: {dailyForecast.weekLowTemp}°
                            {unit === "metric" ? "C" : "F"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Forecast;
