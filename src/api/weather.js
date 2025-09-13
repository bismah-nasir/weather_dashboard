// // API to fetch current weather by city
// export async function fetchWeather(city, unit = "metric") {
//     const API_KEY = import.meta.env.VITE_APP_ID;
//     const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

//     try {
//         const res = await fetch(
//             `${BASE_URL}?q=${city}&appid=${API_KEY}&units=${unit}`
//         );

//         if (!res.ok) throw new Error("City not found");

//         const data = await res.json();
//         console.log("Weather API Response:", data);
//         return data;
//     } catch (error) {
//         console.error("Error fetching weather:", error);
//         return null;
//     }
// }

// // API to fetch weather forecast by city
// export async function fetchForecast(city, unit = "metric") {
//     const API_KEY = import.meta.env.VITE_APP_ID;
//     const BASE_URL = "https://api.openweathermap.org/data/2.5/forecast";

//     try {
//         const res = await fetch(
//             `${BASE_URL}?q=${city}&appid=${API_KEY}&units=${unit}`
//         );

//         if (!res.ok) throw new Error("City not found");

//         const data = await res.json();
//         console.log("Forecast API Response:", data);
//         return data;
//     } catch (error) {
//         console.error("Error fetching weather:", error);
//         return null;
//     }
// }

// // API to fetch Air Quality data
// export async function fetchAirQuality(lat, lon) {
//     const API_KEY = import.meta.env.VITE_APP_ID;
//     const BASE_URL = "https://api.openweathermap.org/data/2.5/air_pollution";

//     try {
//         const res = await fetch(
//             `${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}`
//         );

//         if (!res.ok) throw new Error("Air quality fetch failed");

//         const data = await res.json();
//         console.log("Air Quality API Response:", data);
//         return data.list[0]; // only return the current data
//     } catch (error) {
//         console.error("Error fetching air quality:", error);
//         return null;
//     }
// }

// API to fetch current weather by city
export async function fetchWeather(city, unit = "metric") {
    const API_KEY = import.meta.env.VITE_APP_ID;
    const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

    const res = await fetch(
        `${BASE_URL}?q=${city}&appid=${API_KEY}&units=${unit}`
    );

    // This is the correct way to handle an error.
    // If the response is not OK (e.g., 404), it will throw.
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "City not found");
    }

    const data = await res.json();
    console.log("Weather API Response:", data);
    return data;
}

// API to fetch weather forecast by city
export async function fetchForecast(city, unit = "metric") {
    const API_KEY = import.meta.env.VITE_APP_ID;
    const BASE_URL = "https://api.openweathermap.org/data/2.5/forecast";

    const res = await fetch(
        `${BASE_URL}?q=${city}&appid=${API_KEY}&units=${unit}`
    );

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "City not found");
    }

    const data = await res.json();
    console.log("Forecast API Response:", data);
    return data;
}

// API to fetch Air Quality data
export async function fetchAirQuality(lat, lon) {
    const API_KEY = import.meta.env.VITE_APP_ID;
    const BASE_URL = "https://api.openweathermap.org/data/2.5/air_pollution";

    const res = await fetch(
        `${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Air quality fetch failed");
    }

    const data = await res.json();
    console.log("Air Quality API Response:", data);
    return data.list[0];
}
