export async function fetchWeather(city, unit = "metric") {
    const API_KEY = import.meta.env.VITE_APP_ID;
    const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

    try {
        const res = await fetch(
            `${BASE_URL}?q=${city}&appid=${API_KEY}&units=${unit}`
        );

        if (!res.ok) throw new Error("City not found");

        const data = await res.json();
        console.log("Weather API Response:", data);
        return data;
    } catch (error) {
        console.error("Error fetching weather:", error);
        return null;
    }
}

export async function fetchForecast(city, unit = "metric") {
    const API_KEY = import.meta.env.VITE_APP_ID;
    const BASE_URL = "https://api.openweathermap.org/data/2.5/forecast";

    try {
        const res = await fetch(
            `${BASE_URL}?q=${city}&appid=${API_KEY}&units=${unit}`
        );

        if (!res.ok) throw new Error("City not found");

        const data = await res.json();
        console.log("Forecast API Response:", data);
        return data;
    } catch (error) {
        console.error("Error fetching weather:", error);
        return null;
    }
}
