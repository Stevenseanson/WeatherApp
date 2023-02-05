function getWeather(city) {
    let APIKey = "e5e44e245d140ee80ea5efbb90b1358e";
    let queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;
    let forecastURL = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}`;

    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        console.log(response);


        let currentDate = moment().format("MM/DD/YYYY");
        let icon = `http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`;
        let temperature = response.main.temp - 273.15;
        temperature = temperature.toFixed(2);
        let humidity = response.main.humidity;
        let windSpeed = response.wind.speed;

        $("#today").empty();
        $("#today").append(`
        <h2 class="text-left">${response.name} (${currentDate})  <img src="${icon}" /></h2>
    
        <p>Temperature:${temperature} &#8451;</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} MPH</p>
      `);


        let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
        searchHistory.push(response.name);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));


        displayHistory();
    });

    // API call for 5-day forecast
    $.ajax({
        url: forecastURL,
        method: "GET",
    }).then(function (forecastResponse) {
        console.log(forecastResponse);

        $("#forecast").empty();
        $("#forecastH2").empty();
        $("#forecastH2").append(`<h2 class="text-left">5-Day Forecast:</h2>`);

        let forecastData = forecastResponse.list.filter(function (reading) {
            return reading.dt_txt.includes("12:00:00");
        });

        forecastData.forEach(function (reading) {
            let forecastDate = moment(reading.dt_txt).format("MM/DD/YYYY");
            let forecastIcon = `http://openweathermap.org/img/wn/${reading.weather[0].icon}@2x.png`;
            let forecastTemp = (reading.main.temp - 273.15).toFixed(2);
            let forecastHumidity = reading.main.humidity;

            $("#forecast").append(`
            <div class="forecast-card-container col-sm-2">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${forecastDate}</h5>
                    <img src="${forecastIcon}"/>
                    <p class="card-text">Temp: ${forecastTemp} &#8451;</p>
                    <p class="card-text">Humidity: ${forecastHumidity}%</p>
                 
                </div>

            </div>
        </div>
    `);
        });
    })
};
// I am not sure how to put the wind in the 5 day forecast without breaking the whole function
function displayHistory() {

    let history = JSON.parse(localStorage.getItem("searchHistory")) || [];

    $("#history").empty();


    let displayCount = Math.min(history.length, 5);


    for (let i = 0; i < displayCount; i++) {
        let city = history[i];
        let cityBtn = $("<button>").addClass("list-group-item list-group-item-action").text(city);
        $("#history").append(cityBtn);
    }
}

$("#search-form").on("submit", function (event) {

    event.preventDefault();


    let city = $("#search-input").val().trim();


    getWeather(city);


    let history = JSON.parse(localStorage.getItem("searchHistory")) || [];

    history.unshift(city);


    localStorage.setItem("searchHistory", JSON.stringify(history));


    displayHistory();

    $("#search-input").val("");
});
$(document).on("click", ".list-group-item", function () {
    let city = $(this).text();
    getWeather(city);
});

$(document).ready(function () {
    getWeather("London, UK");
});
