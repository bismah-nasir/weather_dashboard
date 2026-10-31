import { useEffect, useState } from "react";
import { RiHeartLine, RiCloseLine } from "react-icons/ri";
import { iconUrlFromCode } from "../utils/utils";
import { fetchWeather } from "../api/weather";

const Favorites = ({ favourites, unit, updateFavourites, setCity }) => {
    const [weatherData, setWeatherData] = useState([]);
    // City whose delete button was just pressed, highlighted until it's removed
    const [removingCity, setRemovingCity] = useState(null);

    useEffect(() => {
        if (favourites.length === 0) {
            setWeatherData([]);
            return;
        }

        // fetch weather for all favourite cities
        const loadWeather = async () => {
            const results = await Promise.all(
                favourites.map(async (city) => {
                    // One failed city shouldn't empty the whole list
                    try {
                        const data = await fetchWeather(city, unit);
                        return { city, data };
                    } catch (error) {
                        console.error(`Error fetching weather for ${city}:`, error);
                        return { city, data: null };
                    }
                })
            );
            // Keep failed cities so they can still be removed
            setWeatherData(results);
        };

        loadWeather();
    }, [favourites, unit]);

    return (
        <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-6 border border-white/30 shadow-xl">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                    <div className="w-6 h-6 flex items-center justify-center">
                        <RiHeartLine
                            className="ri-heart-line text-2xl text-pink-300"
                            style={{ strokeWidth: 1 }}></RiHeartLine>
                    </div>
                    Favorites
                </h3>
                <div className="text-white/60 text-sm">
                    {favourites.length} {favourites.length === 1 ? "city" : "cities"}
                </div>
            </div>

            <div className="space-y-3">
                {favourites.length === 0 ? (
                    <p className="text-white/70">No favourites yet!</p>
                ) : (
                    weatherData.map(({ city, data }, index) => {
                        const openCity = () => {
                            setCity(city);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        };

                        return (
                            // A div with button semantics, since the delete button can't be nested in a <button>
                            <div
                                key={index}
                                role="button"
                                tabIndex={0}
                                onClick={openCity}
                                onKeyDown={(e) => {
                                    if (e.target !== e.currentTarget) return;
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        openCity();
                                    }
                                }}
                                className="w-full text-left flex items-center justify-between p-4 bg-white/10 rounded-2xl backdrop-blur-sm hover:bg-white/20 transition-all duration-300 group cursor-pointer">
                                <div className="flex items-center gap-3 flex-1">
                                    <div className="w-10 h-10 flex items-center justify-center">
                                        {data && (
                                            <img
                                                src={iconUrlFromCode(
                                                    data.weather[0].icon
                                                )}
                                                alt="weather icon"
                                            />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-white font-semibold text-sm capitalize">
                                            {city}
                                        </div>
                                        <div className="text-white/60 text-xs capitalize">
                                            {data
                                                ? data.weather[0].description
                                                : "Weather unavailable"}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {data && (
                                        <div className="text-white font-bold text-lg">
                                            {Math.round(data.main.temp)}°
                                            {unit === "metric" ? "C" : "F"}
                                        </div>
                                    )}

                                    {/* Delete favourite button */}
                                    <button
                                        type="button"
                                        aria-label={`Remove ${city} from favourites`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // Brief visual feedback before the row disappears
                                            setRemovingCity(city);
                                            setTimeout(() => {
                                                updateFavourites(city);
                                                setRemovingCity(null);
                                            }, 150);
                                        }}
                                        className={`opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 hover:text-pink-300 active:text-pink-300 transition-all duration-300 ${
                                            removingCity === city
                                                ? "text-pink-300"
                                                : "text-white/60"
                                        }`}>
                                        <div className="w-6 h-6 flex items-center justify-center">
                                            <RiCloseLine className="text-lg" />
                                        </div>
                                    </button>
                                </div>
                            </div>
                        );
                    })
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
