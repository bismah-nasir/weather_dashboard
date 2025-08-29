import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { RiDropLine } from "react-icons/ri";
import { RiWindyLine } from "react-icons/ri";
import {
    iconUrlFromCode,
    formatToLocalTime,
    convertWindSpeed,
    processForecastData,
} from "../utils/utils";
import { FaTemperatureHigh, FaTemperatureLow } from "react-icons/fa";

const CurrentWeather = ({
    weather,
    forecast,
    unit,
    city,
    favourites,
    updateFavourites,
}) => {
    const isFavorite = favourites.includes(city.toLowerCase());

    if (!weather) return null;

    const formattedTime = formatToLocalTime(weather.dt, weather.timezone);

    const img = iconUrlFromCode(weather.weather[0].icon);

    const dailyForecast = processForecastData(forecast?.list);

    if (!dailyForecast) {
        return <p>Loading forecast...</p>;
    }

    return (
        <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 border border-white/30 shadow-xl">
            {/* Location and Time */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                        {weather.name}
                    </h2>
                    <p className="text-white/80 text-lg">
                        {"Today • " + formattedTime}
                    </p>
                </div>
                <button
                    onClick={() => {
                        updateFavourites(city);
                    }}
                    className="text-white hover:text-yellow-300 transition-colors duration-300 cursor-pointer">
                    <div class="w-8 h-8 flex items-center justify-center">
                        {isFavorite ? (
                            <FaHeart className="text-2xl" />
                        ) : (
                            <FaRegHeart className="text-2xl" />
                        )}
                    </div>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Temperature */}
                <div className="text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
                        <div className="w-20 h-20 flex items-center justify-center">
                            <img src={img}></img>
                        </div>
                        <div>
                            <div className="text-6xl font-bold text-white">
                                {Math.round(weather.main.temp)}°
                                {unit === "metric" ? "C" : "F"}
                            </div>
                            <div className="text-white/80 text-xl">
                                Feels like {Math.round(weather.main.feels_like)}
                                °{unit === "metric" ? "C" : "F"}
                            </div>
                        </div>
                    </div>
                    <div className="text-2xl text-white/90 font-medium capitalize">
                        {weather.weather[0].description}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                    {/* Humidity */}
                    <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-6 h-6 flex items-center justify-center">
                                <RiDropLine
                                    class="text-2xl text-blue-300"
                                    style={{ strokeWidth: 1 }}></RiDropLine>
                            </div>
                            <span className="text-white/80 text-sm">
                                Humidity
                            </span>
                        </div>
                        <div className="text-2xl font-bold text-white">
                            {weather.main.humidity}%
                        </div>
                    </div>

                    {/* Wind Speed */}
                    <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-6 h-6 flex items-center justify-center">
                                <RiWindyLine className="text-2xl text-cyan-300"></RiWindyLine>
                            </div>
                            <span className="text-white/80 text-sm">
                                Wind Speed
                            </span>
                        </div>
                        <div className="text-2xl font-bold text-white">
                            {convertWindSpeed(weather.wind.speed, unit)} km/h
                        </div>
                    </div>

                    {/* High Temperature */}
                    <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-6 h-6 flex items-center justify-center">
                                <FaTemperatureHigh className="text-2xl text-red-400"></FaTemperatureHigh>
                            </div>
                            <span className="text-white/80 text-sm">High</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-2xl font-bold text-white">
                                {dailyForecast.dailySummaries[0].highTemp}°
                                {unit === "metric" ? "C" : "F"}
                            </div>
                        </div>
                    </div>

                    {/* Low Temperature */}
                    <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-6 h-6 flex items-center justify-center">
                                <FaTemperatureLow className="text-2xl text-green-400"></FaTemperatureLow>
                            </div>
                            <span className="text-white/80 text-sm">Low</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-2xl font-bold text-white">
                                {dailyForecast.dailySummaries[0].lowTemp}°
                                {unit === "metric" ? "C" : "F"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CurrentWeather;
