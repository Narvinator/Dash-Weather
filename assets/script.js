var key = "c30ab354a125069f3c860338a8a1704d"
var cities = []
var api = "api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}"

var City = $("#current-city");
var temp = $("#current-temp");
var humidity = $("#current-humidity");
var windSpeed = $("#current-wind-speed");
var uvIndex = $("#uv-index");

var historyList = $('#search-history-list');
var cityInput = $("#search-city");
var cityButton = $("#search-city-button");
var clearButton = $("#clear-history");
