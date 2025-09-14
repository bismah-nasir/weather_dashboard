import { useEffect, useState } from "react";
import { RiHeartLine, RiCloseLine } from "react-icons/ri";
import { iconUrlFromCode } from "../utils/utils";
import { fetchWeather } from "../api/weather";

const Favorites = ({ favourites, unit, updateFavourites, setCity }) => {
    const [weatherData, setWeatherData] = useState([]);

    useEffect(() => {
        if (favourites.length === 0) {
            setWeatherData([]);
            return;
        }

        // fetch weather for all favourite cities
        const loadWeather = async () => {
            const results = await Promise.all(
                favourites.map(async (city) => {
                    const data = await fetchWeather(city, unit);
                    return { city, data };
                })
            );
            setWeatherData(results.filter((r) => r.data));
        };

        loadWeather();
    }, [favourites, unit]);

    return (
        <div class="bg-white/20 backdrop-blur-sm rounded-3xl p-6 border border-white/30 shadow-xl">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-bold text-white flex items-center gap-3">
                    <div class="w-6 h-6 flex items-center justify-center">
                        <RiHeartLine
                            class="ri-heart-line text-2xl text-pink-300"
                            style={{ strokeWidth: 1 }}></RiHeartLine>
                    </div>
                    Favorites
                </h3>
                <div class="text-white/60 text-sm">
                    {favourites.length} cities
                </div>
            </div>

            <div class="space-y-3">
                {favourites.length === 0 ? (
                    <p className="text-white/70">No favourites yet!</p>
                ) : (
                    weatherData.map(({ city, data }, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setCity(city);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="w-full text-left flex items-center justify-between p-4 bg-white/10 rounded-2xl backdrop-blur-sm hover:bg-white/20 transition-all duration-300 group">
                            <div className="flex items-center gap-3 flex-1">
                                <div className="w-10 h-10 flex items-center justify-center">
                                    <img
                                        src={iconUrlFromCode(
                                            data.weather[0].icon
                                        )}
                                        alt="weather icon"
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="text-white font-semibold text-sm capitalize">
                                        {city}
                                    </div>
                                    <div className="text-white/60 text-xs capitalize">
                                        {data.weather[0].description}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="text-white font-bold text-lg">
                                    {Math.round(data.main.temp)}°
                                    {unit === "metric" ? "C" : "F"}
                                </div>

                                {/* Delete favourite button */}
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // Add visual feedback by temporarily changing color
                                        e.target.closest('button').classList.add('text-pink-300');
                                        setTimeout(() => {
                                            updateFavourites(city);
                                        }, 150);
                                    }}
                                    className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 text-white/60 hover:text-pink-300 active:text-pink-300 transition-all duration-300">
                                    <div className="w-6 h-6 flex items-center justify-center">
                                        <RiCloseLine className="text-lg" />
                                    </div>
                                </button>
                            </div>
                        </button>
                    ))
                )}
            </div>
            <div className="mt-4 pt-4 border-t border-white/20">
                <div className="flex items-center justify-center sm:justify-between text-xs text-white/60">
                    <span className="sm:hidden">Click to view</span>
                    <span className="hidden sm:block">Click to view • Hover to remove</span>
                </div>
            </div>
        </div>
    );
};

export default Favorites;
