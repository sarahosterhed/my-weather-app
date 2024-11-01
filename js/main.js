// Base URL and parameters
const apiKey = "903ddcd89f258c2d7a183180e626b811";
const baseURL = "https://api.openweathermap.org/data/2.5/";
const getWeather = "weather"
const getForecast = "forecast"

// Get elements
const cityInput = document.getElementById("city-input");
const currentWeatherIcon = document.getElementById("current-weather-icon");
const currentTemperature = document.getElementById("current-temperature");
const currentCity = document.getElementById("current-city");
const currentWeatherDescription = document.getElementById("current-weather-description");
const sunHours = document.getElementById("sun-hours");

const forecastWeekdays = document.getElementById("forecast-weekdays");
const forecastIcons = document.getElementById("forecast-icons");
const forecastTemperatures = document.getElementById("forecast-temperatures");

const errorMessage = document.getElementById("error-message");

//Set default city
let city = "Stockholm";

//Set array of favoriteCities
const favoriteCities = [];

//Fetch current weather
const fetchCurrentWeather = async () => {
    const currentWeatherUrl = `${baseURL}${getWeather}?q=${city}&units=metric&APPID=${apiKey}`;
    try {
        const response = await fetch(currentWeatherUrl);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("City not found, enter a valid city name.");
            } else {
                throw new Error(`Error code: ${response.status}, ${response.statusText}`);
            }
        }
        const weatherData = await response.json();

        // Clear error message
        errorMessage.innerText = "";

        const { main, name, sys, weather } = weatherData;

        //Current temperature
        currentTemperature.innerText = Math.round(main.temp);
        //Current city
        currentCity.innerText = name;

        weather.map(({ id, description }) => {
            currentWeatherDescription.innerHTML = "";
            //Get the image name from the respective id
            const imageName = getWeatherImageName(id);

            //Set the alt text, image, which element to append it to and singleDisplay
            setWeatherIcon(description, imageName, currentWeatherIcon, true);
            //Set weather description
            currentWeatherDescription.innerText = description;
        })

        //Set time for sunrise & sunset
        const sunrise = new Date(sys.sunrise * 1000);
        const sunset = new Date(sys.sunset * 1000);
        sunHours.innerHTML = `<p>sunrise</p>
            <p>${formatSunHours(sunrise)}</p>
            <p>sunset</p>
            <p>${formatSunHours(sunset)}</p>`;

    } catch (error) {
        console.log(error);
        errorMessage.innerText = error.message;
    }
}

//Fetch weather forecast
const fetchWeatherForecast = async () => {
    const forecastUrl = `${baseURL}${getForecast}?q=${city}&units=metric&APPID=${apiKey}`;
    try {
        const response = await fetch(forecastUrl);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("City not found. Please enter a valid city name.");
            } else {
                throw new Error(`Error code: ${response.status}, ${response.statusText}`);
            }
        }

        const forecastData = await response.json();

        const { list } = forecastData;

        // Create new array of forecast data at 12:00
        const dayTime = filterByHour(list, 12);
        // Create new array of forecast data at 00:00
        const nightTime = filterByHour(list, 0);


        const daysOfTheWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        //Create array of the names of upcoming five weekdays
        const forecastDays = dayTime.map(({ dt_txt }) => {
            const dayIndex = new Date(dt_txt).getDay();
            return daysOfTheWeek[dayIndex];
        })

        //Add weekdays to html
        forecastWeekdays.innerHTML = "";
        const dayList = document.createElement("ul");
        //Add each day in a list item
        for (let i = 0; i < forecastDays.length; i++) {
            const addDays = document.createElement("li");
            addDays.innerText = `${forecastDays[i]}`;
            dayList.appendChild(addDays);
            forecastWeekdays.appendChild(dayList);
        }

        //Add weather icons to html
        forecastIcons.innerHTML = "";
        dayTime.map(({ weather }) => {
            weather.map(({ id, description }) => {
                //Get the image name from the respective id
                const imageName = getWeatherImageName(id);
                //Set the alt text, image, which element to append it to and set singleDisplay to false
                setWeatherIcon(description, imageName, forecastIcons, false);
            })
        })

        //Round daily and nightly temperatures to no decimals
        const dailyTemps = dayTime.map(({ main }) => Math.round(main.temp))
        const nightlyTemps = nightTime.map(({ main }) => Math.round(main.temp))

        //Add temperatures to html
        forecastTemperatures.innerHTML = "";
        const tempratureList = document.createElement("ul");
        // Add temperatures for the upcoming 5 days
        for (let i = 0; i < dailyTemps.length; i++) {
            const addTemperature = document.createElement("li");
            addTemperature.textContent = `${dailyTemps[i]}° / ${nightlyTemps[i]} °C`;
            tempratureList.appendChild(addTemperature);
            forecastTemperatures.appendChild(tempratureList);
        }

    } catch (error) {
        console.log(error);
    }

}

// Function to determine image name based on the weather id
const getWeatherImageName = (id) => {
    if (id === 800) return "sun";
    if (id >= 801 && id <= 802) return "sun-cloud";
    if (id >= 803 && id <= 804) return "cloud";
    if (id >= 701 && id <= 781) return "mist";
    if (id >= 600 && id <= 622) return "snow";
    if (id >= 500 && id <= 531) return "rain";
    if (id >= 300 && id <= 321) return "light-rain";
    if (id >= 200 && id <= 232) return "thunderstorm";
    return "";
};

//Function for adding weather icon
const setWeatherIcon = (description, imageName, appendToElement, singleDisplay) => {
    let weatherIcon = document.createElement("img");
    weatherIcon.alt = description;
    weatherIcon.src = `./img/${imageName}.png`;
    if (singleDisplay) {
        appendToElement.innerHTML = "";
    }
    appendToElement.appendChild(weatherIcon);
}

//Function to format time for sunrise & sunset
const formatSunHours = (timestamp) => {
    //Get hours and display it with two digits
    const hours = String(timestamp.getHours()).padStart(2, "0");
    //Get minutes and display it with two digits
    const minutes = String(timestamp.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`
}

// Function to filter weather data based on a specific hour
const filterByHour = (list, targetHour) => {
    return list.filter((item) => {
        const dateTime = new Date(item.dt_txt);
        return dateTime.getHours() === targetHour;
    });
};

//Functon for retrieving city input
const getCityInput = (event) => {
    city = event.target.value;
    event.target.value = "";

    fetchCurrentWeather();
    fetchWeatherForecast();
}

//Eventlistener for input field
cityInput.addEventListener("change", getCityInput)

// const addToFavoriteCities = () => {
//     favoriteCities.push(city);
// }

// const button = document.querySelector(".button");

// button.addEventListener("click", (event) => {
//     city = favoriteCities
// })

fetchCurrentWeather();

fetchWeatherForecast();
