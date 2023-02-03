let apiKey = "e5e44e245d140ee80ea5efbb90b1358e";
let cityName = "Toronto";

$.ajax({
    url: `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`,
    type: "GET",
    dataType: "json",
    success: function (data) {
        // Extract the latitude and longitude from the response data
        let lat = data.coord.lat;
        let lon = data.coord.lon;
    },
    error: function (error) {
        // Handle the error
    }
});