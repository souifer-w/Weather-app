const search = document.querySelector(".btn-search");
const inputSearch = document.querySelector(".search-weather");
const forecastAir = document.querySelector(".forecast-air");
const hero = document.querySelector(".hero");
const locationHtml = document.querySelector(".location");
const containerWeather = document.querySelector(".container-weather");
search.addEventListener("click", (e) => {
  inputSearch.classList.add("icon-click");
  const city = inputSearch.value.trim();
  getWeather(city);
});
inputSearch.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    inputSearch.classList.add("icon-click");
    const city = inputSearch.value.trim();
    getWeather(city);
  }
});

getWeather("marrakech");
async function getWeather(city) {
  try {
    const apiKey = "abdc359b9abb425bbdc220742262903";
    const url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5`;
    const response = await fetch(url);
    let data = await response.json();
    displayWeather(data);
  } catch (error) {
    containerWeather.classList.add("city-undefined");
    containerWeather.innerHTML = `
  <div class="error-container">
    <img src="unknown.png" alt="city undefined" class="error-img">
    <h1>Error: this city is undefined</h1>
  </div>
`;
    locationHtml.innerHTML = "";
  }
}
function displayWeather(data) {
  const weatherDetails = {
    name: data.location.name,
    tz_id: data.location.tz_id,
    localtime: data.location.localtime,
    country: data.location.country,
    could: data.current.cloud,
    icon: data.current.condition.icon,
    text: data.current.condition.text,
    temp_c: data.current.temp_c,
    wind_kph: data.current.wind_kph,
    humidity: data.current.humidity,
    uv: data.current.uv,
    night: data.current.is_day,
  };
  if (weatherDetails.night === 0) {
    document.body.classList.add("night");
  } else {
    document.body.classList.remove("night");
  }
  const dateObj = new Date(weatherDetails.localtime);
  const options = { weekday: "long", day: "2-digit", month: "long" };
  const formattedDate = dateObj.toLocaleDateString("en-US", options);
  let heroWeather = "";
  let weatherHTML = "";
  locationHtml.innerHTML = weatherDetails.tz_id;
  const htmlhero = `
   <h2>${weatherDetails.name} , ${weatherDetails.country}</h2>
        <p>${formattedDate}</p>

        <div class="weather-icon"> <img src="${weatherDetails.icon}" alt="Weather Icon"></div>
        <div class="temp">${Math.floor(weatherDetails.temp_c)}°C</div>
        <div class="condition">${weatherDetails.text}</div>
       <div class="grid">
        <div class="glass card">
        <span class="material-symbols-outlined">humidity_percentage</span>
          <small>Humidity</small>
          <h3>${weatherDetails.humidity}%</h3>
        </div>
        <div class="glass card">
          <span class="material-symbols-outlined">air</span>
          <small>Wind</small>
          <h3>${weatherDetails.wind_kph} km/h</h3>
        </div>
        <div class="glass card">
          <span class="material-symbols-outlined">wb_sunny</span>
          <small>UV Index</small>
          <h3>${weatherDetails.uv}</h3></div>
      </div>
  `;
  heroWeather += htmlhero;
  hero.innerHTML = heroWeather;
  const forecast = data.forecast.forecastday;
  forecast.forEach((day) => {
    const dateObjdays = new Date(day.date);
    const optionsdays = { weekday: "short" };
    const formattedDatedays = dateObjdays.toLocaleDateString(
      "en-US",
      optionsdays,
    );
    const html = `
        <div class="forecast-item">
          <span class="day">${formattedDatedays}</span>
          <img src="${day.day.condition.icon}" alt="Weather Icon">
          <span> ${Math.floor(day.day.maxtemp_c)}°/ ${Math.floor(day.day.mintemp_c)}°</span>
        </div>
    `;
    weatherHTML += html;
  });
  forecastAir.innerHTML = `<h3>5-Day Forecast</h3>${weatherHTML}`;
}
