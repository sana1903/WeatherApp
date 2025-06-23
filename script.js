// 💡 Weather by City Name
async function getWeather() {
  const city = document.getElementById("cityInput").value;
  const apiKey = "09a6aa6431fe64753b2f2bcb050cddc2"; // 🔁 Replace with your actual OpenWeatherMap key

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod === 200) {
      displayWeather(data);
      showMap(data.coord.lat, data.coord.lon, data.name);
    } else {
      document.getElementById("weatherResult").innerHTML = `<p>City not found!</p>`;
    }
  } catch (error) {
    console.error(error);
    document.getElementById("weatherResult").innerHTML = `<p>Something went wrong!</p>`;
  }
}

// 📍 Weather by Current GPS Location
async function getLocationWeather() {
  const apiKey = "09a6aa6431fe64753b2f2bcb050cddc2"; // 🔁 Replace with your actual key

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod === 200) {
          displayWeather(data);
          showMap(lat, lon, data.name);
        } else {
          document.getElementById("weatherResult").innerHTML = `<p>Location not found!</p>`;
        }
      } catch (error) {
        console.error(error);
        document.getElementById("weatherResult").innerHTML = `<p>Something went wrong!</p>`;
      }
    });
  } else {
    document.getElementById("weatherResult").innerHTML = `<p>Geolocation not supported by your browser!</p>`;
  }
}

// ✨ Display Weather Info in HTML

  function displayWeather(data) {
    document.getElementById("weatherResult").innerHTML = `
    <p><strong>City:</strong> ${data.name}, ${data.sys.country}</p>
    <p><strong>Temperature:</strong> ${data.main.temp}°C</p>
    <p><strong>Condition:</strong> ${data.weather[0].main}</p>
    <p><strong>Latitude:</strong> ${data.coord.lat}</p>
    <p><strong>Longitude:</strong> ${data.coord.lon}</p>
    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="weather icon" />
  `;
  }



// 🗺️ Show Map with Leaflet
function showMap(lat, lon, cityName) {
  // Remove old map
  if (window.myMap) {
    window.myMap.remove();
  }

  // Create new map
  window.myMap = L.map("map").setView([lat, lon], 13);

  // Add map layer
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(window.myMap);

  // Add marker
  L.marker([lat, lon]).addTo(window.myMap)
    .bindPopup(`📍 ${cityName}`)
    .openPopup();
}
