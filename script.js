
function getWeather(city) {
    let APIKey = "e5e44e245d140ee80ea5efbb90b1358e";
    let queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;
    let forecastURL = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}`;

    // API call for current weather conditions
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        console.log(response);

        // 2. Parse the response data and display the current weather conditions
        let currentDate = moment().format("MM/DD/YYYY");
        let icon = `http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`;
        let temperature = response.main.temp - 273.15;
        temperature = temperature.toFixed(2);
        let humidity = response.main.humidity;
        let windSpeed = response.wind.speed;

        $("#today").empty();
        $("#today").append(`
        <h2 class="text-left">${response.name} (${currentDate})</h2>
        <div class="d-flex justify-content-center">
          <img src="${icon}" />
          <p class="current-temp">${temperature} &#8451;</p>
        </div>
        <p class="text-center">Humidity: ${humidity}%</p>
        <p class="text-center">Wind Speed: ${windSpeed} MPH</p>
      `);

        // 3. Store the search history in localStorage
        let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
        searchHistory.push(response.name);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

        // Display the search history
        displaySearchHistory();
    });

    // API call for 5-day forecast
    $.ajax({
        url: forecastURL,
        method: "GET",
    }).then(function (forecastResponse) {
        console.log(forecastResponse);
        // 2. Parse the forecast data and display it
        $("#forecast").empty();
        $("#forecast").append(`<h2 class="text-left">5-Day Forecast:</h2>`);

        let forecastData = forecastResponse.list.filter(function (reading) {
            return reading.dt_txt.includes("12:00:00");
        });

        forecastData.forEach(function (reading) {
            let forecastDate = moment(reading.dt_txt).format("MM/DD/YYYY");
            let forecastIcon = `http://openweathermap.org/img/wn/${reading.weather[0].icon}@2x.png`;
            let forecastTemp = (reading.main.temp - 273.15).toFixed(2);
            let forecastHumidity = reading.main.humidity;

            $("#forecast").append(`
    <div class="col-2">
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">${forecastDate}</h5>
                <img src="${forecastIcon}" />
                <p class="card-text">Temperature: ${forecastTemp} &#8451;</p>
                <p class="card-text">Humidity: ${forecastHumidity}%</p>
            </div>
        </div>
    </div>
    `);
        });
    })
};

$("#search-form").submit(function (event) {
    event.preventDefault();
    let city = $("#search-input").val().trim();
    getWeather(city);
});


//     // 4. Retrieve the weather data for a city when a user clicks on it in the search history
//     $(document).on("click", ".list-group-item"), function () {
//     let city = $(this).text();
//     let APIKey = "e5e44e245d140ee80ea5efbb90b1358e";
//     let queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;

//     $.ajax({
//         url: queryURL,
//         method: "GET",
//     }).then(function (response) {
//         console.log(response);

//         // Display the current weather conditions
//         let currentDate = moment().format("MM/DD/YYYY");
//         let icon = `http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`;
//         let temperature = (response.main.temp - 273.15);
//         temperature = temperature.toFixed(2);
//         let humidity = response.main.humidity;
//         let windSpeed = response.wind.speed;

//         $("#today").html(`
//             <h2 class="text-center">${city} (${currentDate})<img src="${icon}"/></h2>
//             <p class="text-center">Temperature: ${temperature} &#8457;</p>
//             <p class="text-center">Humidity: ${humidity}%</p>
//             <p class="text-center">Wind Speed: ${windSpeed} MPH</p>
//         `);
//     });
// });
// THIS IS FOR THE PREVIOUS SEARCHES

// Function to display the previously searched cities
function displayHistory() {
    // Get the search history from local storage
    var history = JSON.parse(localStorage.getItem("searchHistory")) || [];

    // Clear the aside section
    $("#history").empty();

    // Loop through the search history and add each city to the aside section
    for (var i = 0; i < history.length && i < 5; i++) {
        var cityBtn = $("<button>").addClass("list-group-item list-group-item-action").text(history[i]);
        $("#history").append(cityBtn);
    }
}

// Call the displayHistory function when the page loads
$(document).ready(function () {
    displayHistory();
});

// Add a click event listener to each city button in the aside section
$(document).on("click", ".list-group-item", function () {
    // Get the city name from the button text
    var city = $(this).text();

    // Get the weather data for the city
    getWeather(city);
});

