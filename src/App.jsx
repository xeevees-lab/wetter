import { useState } from 'react'
import './App.css'

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");

  const apiKey = "f501b0286f6c56f08e8bdf9738b4e5b2"; // <--  OpenWeather API key here


  // Fetch latitude & longitude from city name
  async function getLonAndLat(city) {
    const countryCode = 1; // You can update this depending on your region
    const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city},${countryCode}&limit=1&appid=${apiKey}`;

    const response = await fetch(geocodeURL);
    if (!response.ok) {
      throw new Error("Failed to fetch coordinates.");
    }

    const data = await response.json();
    if (data.length === 0) {
      throw new Error(`Invalid city: "${searchInput}". Try again.`);
    }

    return data[0]; // Return first matching location
  }

  // Fetch weather data using lon & lat
  async function getWeatherData(lon, lat) {
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    const response = await fetch(weatherURL);
    if (!response.ok) {
      throw new Error("Failed to fetch weather.");
    }

    return await response.json();
  }

  // Handle form submit
  async function fetchWeather(e) {
    e.preventDefault();
    setError("");
    setWeatherData(null);

    if (!searchInput.trim()) {
      setError("Please enter a valid city name.");
      return;
    }

    try {
      const geoData = await getLonAndLat(searchInput.trim());
      const weather = await getWeatherData(geoData.lon, geoData.lat);
      setWeatherData(weather);
    } catch (err) {
      setError(err.message);
    } finally {
      setSearchInput("");
    }
  }


  return (
    <div className="weather-wrapper">
      <h1>Weather Forecast App</h1>

      <div className="weather-search">
        <input id='search'
          type="text"
          placeholder="Search by city"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button id='submit' onClick={fetchWeather}>Search</button>
      </div>


       {error && (
        <div className="bg-red-500 p-4 rounded-lg mb-4 w-80 text-center">
          {error}
        </div>
      )}
       {weatherData && (
        <div className="weather-data" style={{display:'flex'}}>
          <img
            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
            alt={weatherData.weather[0].description}
            className="w-16 h-16"
          />
          <div>
            <h2 className="text-2xl font-semibold">{weatherData.name}</h2>
            <p>
              <strong>Temp:</strong>{" "}
              {Math.round(weatherData.main.temp - 273.15)}°C
            </p>
            <p>
              <strong>Description:</strong>{" "}
              {weatherData.weather[0].description}
            </p>
          </div>
        </div>
      )}
    </div>
   )
}

export default App
