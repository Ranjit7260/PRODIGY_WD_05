// API Key (Weatherstack)
const API_KEY = "f4919d1ef57fdd4450d1c4b40417d9a3";

// DOM Elements (same as before)
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const locationBtn = document.getElementById("location-btn");
const weatherCard = document.getElementById("weather-card");
const errorMessage = document.getElementById("error-message");

// Weather Data Elements (same as before)
const cityElement = document.getElementById("city");
const countryElement = document.getElementById("country");
const tempElement = document.getElementById("temperature");
const weatherIcon = document.getElementById("weather-icon");
const weatherDesc = document.getElementById("weather-description");
const feelsLike = document.getElementById("feels-like");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");

// Fetch Weather by City (Updated for Weatherstack)
async function fetchWeatherByCity(city) {
  try {
    showLoading();
    const response = await fetch(
      `http://api.weatherstack.com/current?access_key=${API_KEY}&query=${city}&units=m`
    );
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.info || "City not found");
    }
    
    displayWeather(data);
  } catch (err) {
    showError(err.message || "Failed to fetch weather data");
  }
}

// Fetch Weather by Location (Updated for Weatherstack)
function fetchWeatherByLocation() {
  if (navigator.geolocation) {
    showLoading();
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `http://api.weatherstack.com/current?access_key=${API_KEY}&query=${latitude},${longitude}&units=m`
          );
          const data = await response.json();
          
          if (data.error) throw new Error(data.error.info);
          displayWeather(data);
        } catch (err) {
          showError(err.message || "Location service failed");
        }
      },
      (error) => {
        showError("Geolocation blocked. Please enable it or search manually.");
      }
    );
  } else {
    showError("Geolocation not supported in your browser");
  }
}

// Display Weather Data (Updated for Weatherstack)
function displayWeather(data) {
  hideLoading();
  
  const { location, current } = data;
  
  cityElement.textContent = location.name;
  countryElement.textContent = location.country;
  tempElement.textContent = `${current.temperature}°C`;
  weatherDesc.textContent = current.weather_descriptions[0];
  feelsLike.textContent = `${current.feelslike}°C`;
  humidity.textContent = `${current.humidity}%`;
  wind.textContent = `${current.wind_speed} km/h`;
  
  // Weatherstack doesn't provide icons directly, so we'll use a mapping
  const iconCode = getWeatherIconCode(current.weather_code);
  weatherIcon.src = `https://cdn.weatherstack.com/images/wn/${iconCode}.png`;
  weatherIcon.alt = current.weather_descriptions[0];
  
  // Animate card update
  weatherCard.style.animation = "none";
  setTimeout(() => {
    weatherCard.style.animation = "fadeIn 0.5s ease";
  }, 10);
}

// Helper: Map Weatherstack codes to icon names (simplified)
function getWeatherIconCode(weatherCode) {
  // Clear
  if (weatherCode === 113) return "01d";
  // Cloudy
  if (weatherCode >= 116 && weatherCode <= 119) return "03d";
  // Rain
  if (weatherCode >= 176 && weatherCode <= 263) return "10d";
  // Snow
  if (weatherCode >= 179 && weatherCode <= 392) return "13d";
  // Thunder
  if (weatherCode >= 200 && weatherCode <= 248) return "11d";
  // Default
  return "01d";
}

// Rest of the code remains the same (showLoading, hideLoading, showError, event listeners)
function showLoading() {
  weatherCard.classList.add("loading");
  errorMessage.style.display = "none";
}

function hideLoading() {
  weatherCard.classList.remove("loading");
}

function showError(message) {
  hideLoading();
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
  setTimeout(() => {
    errorMessage.style.animation = "fadeIn 0.3s ease";
  }, 10);
}

// Event Listeners (same as before)
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeatherByCity(city);
  } else {
    showError("Please enter a city name.");
  }
});

locationBtn.addEventListener("click", fetchWeatherByLocation);

cityInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    const city = cityInput.value.trim();
    if (city) fetchWeatherByCity(city);
  }
});

// Initialize with a default city
fetchWeatherByCity("London");