import NavBar from "./components/NavBar";
import SearchBar from "./components/SearchBar";
import CurrentWeather from "./components/CurrentWeather";
import HourlyChart from "./components/HourlyChart";
import Forecast from "./components/Forecast";
import AirQuality from "./components/AirQuality";
import Favorites from "./components/Favorites";
import SunMoonTimings from "./components/SunMoonTimings";
import { useState, useEffect } from "react";
import { fetchWeather, fetchForecast } from "./api/weather";
import { formatToLocalTime } from "./utils/utils";
const App = () => {
    const [city, setCity] = useState("Karachi");
    const [unit, setUnit] = useState("metric"); // "metric" = °C, "imperial" = °F
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [favourites, setFavourites] = useState(
        JSON.parse(localStorage.getItem("favourites")) || []
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const sunrise = formatToLocalTime(
        weather?.sys?.sunrise,
        weather?.timezone,
        "HH:mm"
    );

    const sunset = formatToLocalTime(
        weather?.sys?.sunset,
        weather?.timezone,
        "HH:mm"
    );

    const localTime = formatToLocalTime(
        weather?.dt,
        weather?.timezone,
        "HH:mm"
    );

    const isDaytime = localTime >= sunrise && localTime < sunset;

    // Function to add city to favourites
    const updateFavourites = (city) => {
        const favoritesCopy = [...favourites];
        let updatedFavorites;
        const lowerCity = city.toLowerCase();
        // Delete city
        if (favoritesCopy.includes(lowerCity)) {
            updatedFavorites = favoritesCopy.filter(
                (favorite) => favorite !== lowerCity
            );
        } else {
            // Add city
            updatedFavorites = [...favoritesCopy, lowerCity];
        }
        setFavourites(updatedFavorites);
        localStorage.setItem("favourites", JSON.stringify(updatedFavorites));
    };

    // Fetch weather when city or unit changes
    useEffect(() => {
        if (!city) return;
        let cancelled = false;

        const load = async () => {
            try {
                setLoading(true);
                setError("");
                const data = await fetchWeather(city, unit);
                if (!cancelled) setWeather(data);
            } catch (e) {
                if (!cancelled)
                    setError(e?.message || "Failed to fetch weather");
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();
        return () => {
            cancelled = true;
        };
    }, [city, unit]);

    // Fetch forecast when city or unit changes
    useEffect(() => {
        if (!city) return;
        let cancelled = false;

        const load = async () => {
            try {
                setLoading(true);
                setError("");
                const data = await fetchForecast(city, unit);
                if (!cancelled) setForecast(data);
            } catch (e) {
                if (!cancelled)
                    setError(e?.message || "Failed to fetch weather");
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();
        return () => {
            cancelled = true;
        };
    }, [city, unit]);

    return (
        <div
            className={`min-h-screen transition-all duration-500 bg-gradient-to-br ${
                isDaytime
                    ? "from-blue-600 via-teal-600 to-cyan-700" // Day gradient
                    : "from-neutral-800 via-black to-gray-700" // Night gradient
            }`}>
            <div className="container mx-auto px-4 py-6 max-w-7xl">
                <NavBar />
                <SearchBar setCity={setCity} unit={unit} setUnit={setUnit} />

                {error && <p className="mt-4 text-red-300">{error}</p>}
                {loading && <p className="mt-4 text-white/80"></p>}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                    <div className="lg:col-span-2 space-y-6">
                        <CurrentWeather
                            weather={weather}
                            forecast={forecast}
                            unit={unit}
                            city={city}
                            favourites={favourites}
                            updateFavourites={updateFavourites}
                        />
                        <HourlyChart
                            weather={weather}
                            forecast={forecast}
                            unit={unit}
                        />
                        <Forecast forecast={forecast} unit={unit} />
                    </div>

                    <div className="space-y-6">
                        <SunMoonTimings weather={weather} />
                        <AirQuality weather={weather} />
                        <Favorites
                            favourites={favourites}
                            unit={unit}
                            updateFavourites={updateFavourites}
                            setCity={setCity}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
