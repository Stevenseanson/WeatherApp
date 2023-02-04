

// 1. Handle form submission and make the API request
$("#search-form").submit(function (event) {
    event.preventDefault();
    var city = $("#search-input").val().trim();

    if (!city) {
        return;
    }

    var APIKey = "e5e44e245d140ee80ea5efbb90b1358e";
    var queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;

    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        console.log(response);

        // 2. Parse the response data and display the current weather conditions
        var currentDate = moment().format("MM/DD/YYYY");
        var icon = `http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`;
        var temperature = (response.main.temp - 273.15) * 1.8 + 32;
        temperature = temperature.toFixed(2);
        var humidity = response.main.humidity;
        var windSpeed = response.wind.speed;

        $("#today").empty();
        $("#today").append(`
        <h2 class="text-center">${response.name} (${currentDate})</h2>
        <div class="d-flex justify-content-center">
          <img src="${icon}" />
          <p class="current-temp">${temperature} &#8457;</p>
        </div>
        <p class="text-center">Humidity: ${humidity}%</p>
        <p class="text-center">Wind Speed: ${windSpeed} MPH</p>
      `);

        // 3. Store the search history in localStorage
        var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
        searchHistory.push(response.name);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

        // Display the search history
        displaySearchHistory();
    });
});

// 4. Retrieve the weather data for a city when a user clicks on it in the search history
$(document).on("click", ".list-group-item", function () {
    var city = $(this).text();
    var APIKey = "your-api-key";
    var queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;

    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        console.log(response);

        // Display the current weather conditions
        var currentDate = moment().format("MM/DD/YYYY");
        var icon = `http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`;
        var temperature = (response.main.temp - 273.15) * 1.8 + 32;
        temperature = temperature.toFixed(2);
        var humidity = response.main.humidity;
        var windSpeed = response.wind.speed;

        $("#today").html(`
            <h2 class="text-center">${city} (${currentDate})<img src="${icon}"/></h2>
            <p class="text-center">Temperature: ${temperature} &#8457;</p>
            <p class="text-center">Humidity: ${humidity}%</p>
            <p class="text-center">Wind Speed: ${windSpeed} MPH</p>
        `);
    });
});
