// NOTE: In a real production project, API keys should never be
// placed directly in frontend code for security reasons.
// This is a demonstration project, so for simplicity the key is placed here.
// In a real project, you would use a backend as a proxy or serverless solutions.
const API_KEY = '899d7d29206376c2e969c0e758956dcd';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const UNITS = 'metric';
const LANG = 'en';


export async function getWeatherByCity(cityName) {
    try {
        const url = `${BASE_URL}?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=${UNITS}&lang=${LANG}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`City not found: ${cityName}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('❌ Error fetching weather data:', error);
        throw error;
    }
}
