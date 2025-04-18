import { getWeatherByCity, getWeatherForecastByCity } from './api.js';

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

const forecastButton = document.getElementById('forecast-button');
const forecastSection = document.getElementById('weather-forecast');
const forecastList = document.querySelector('.weather__forecast-list');

forecastButton.addEventListener('click', async () => {
    const city = inputElement.value.trim();
    if (!city) return;

    try {
        const forecastData = await getWeatherForecastByCity(city);
        displayForecast(forecastData);
        forecastSection.style.display = 'block';
    } catch (error) {
        console.error('Error fetching forecast:', error);
    }
});

function displayForecast(forecastData) {
    forecastList.innerHTML = '';

    const dailyForecast = {};
    const today = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    forecastData.list.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

        if (date === today) return;

        if (!dailyForecast[date]) {
            dailyForecast[date] = {
                temp_max: -Infinity,
                temp_min: Infinity,
                icon: '',
                description: ''
            };
        }

        dailyForecast[date].temp_max = Math.max(dailyForecast[date].temp_max, item.main.temp_max);
        dailyForecast[date].temp_min = Math.min(dailyForecast[date].temp_min, item.main.temp_min);

        const hour = new Date(item.dt * 1000).getHours();
        if (hour >= 10 && hour <= 14 && !dailyForecast[date].icon) {
            dailyForecast[date].icon = item.weather[0].icon;
            dailyForecast[date].description = item.weather[0].description;
        }
    });

    for (const day in dailyForecast) {
        const forecastItem = document.createElement('div');
        forecastItem.classList.add('weather__forecast-item');

        const dayName = document.createElement('h3');
        dayName.textContent = day;

        const tempMax = document.createElement('p');
        tempMax.textContent = `Max: ${(Math.round(dailyForecast[day].temp_max)).toFixed(0)}°C`;

        const tempMin = document.createElement('p');
        tempMin.textContent = `Min: ${(Math.round(dailyForecast[day].temp_min)).toFixed(0)}°C`;

        const icon = document.createElement('img');
        icon.src = `https://openweathermap.org/img/wn/${dailyForecast[day].icon}@2x.png`;
        icon.alt = dailyForecast[day].description;
        icon.classList.add('weather__forecast-icon');

        forecastItem.appendChild(dayName);
        forecastItem.appendChild(tempMax);
        forecastItem.appendChild(tempMin);
        forecastItem.appendChild(icon);
        forecastList.appendChild(forecastItem);
    }
}
