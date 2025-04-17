import { getWeatherByCity } from './api.js';

const themeToggleButton = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme') || 'light';

document.documentElement.setAttribute('data-theme', currentTheme);

function updateButton() {
    const theme = document.documentElement.getAttribute('data-theme');

    if (theme === 'light') {
        themeToggleButton.querySelector('.theme-toggle__text').textContent = 'Dark Mode';
        themeToggleButton.querySelector('.theme-toggle__icon').textContent = '🌙';
        themeToggleButton.querySelector('.theme-toggle__icon_2').textContent = '🌙';
    } else {
        themeToggleButton.querySelector('.theme-toggle__text').textContent = 'Light Mode';
        themeToggleButton.querySelector('.theme-toggle__icon').textContent = '🌞';
        themeToggleButton.querySelector('.theme-toggle__icon_2').textContent = '🌞';
    }
}

updateButton();

themeToggleButton.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);

    localStorage.setItem('theme', newTheme);

    updateButton();
});

const inputElement = document.querySelector('.weather__input');
const searchButton = document.querySelector('.weather__search-button');
const cityNameElement = document.querySelector('.weather__city-name');
const temperatureElement = document.querySelector('.weather__temperature');
const iconElement = document.querySelector('.weather__icon');
const descriptionElement = document.querySelector('.weather__description');

searchButton.addEventListener('click', async () => {
    const city = inputElement.value.trim();

    if (!city) return;

    try {
        cityNameElement.textContent = 'Loading...';
        temperatureElement.textContent = '--°C';
        descriptionElement.textContent = '-';
        iconElement.src = '';

        const data = await getWeatherByCity(city);

        const temperatureValue = parseFloat(data.main.temp);
        const description = data.weather[0].description;
        const icon = data.weather[0].icon;

        cityNameElement.textContent = `${data.name}, ${data.sys.country}`;

        const formattedTemperature = (Math.floor(temperatureValue * 10) / 10).toFixed(1);
        temperatureElement.textContent = `${formattedTemperature}°C`;

        descriptionElement.textContent = description;
        iconElement.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
        iconElement.alt = description;
    } catch (err) {
        cityNameElement.textContent = 'City not found';
        temperatureElement.textContent = '';
        descriptionElement.textContent = 'Please try again';
        iconElement.src = '';
    }
});

inputElement.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchButton.click();
    }
});