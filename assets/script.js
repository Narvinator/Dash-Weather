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

var weatherContent = $("#weather-content");

var date = dayjs().format("MM/D/YYYY")

function currentConditionsRequest(searchValue) {


    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&units=imperial&appid=" + key;


    fetch(queryURL)
    .then(function (response) {
      return response.json();
    }).then(function(response){
        console.log(response);
        city.text(response.name);
        city.append("<small class='text-muted' id='current-date'>");
        $("#current-date").text("(" + date + ")");
        city.append("<img src='https://openweathermap.org/img/w/" + response.weather[0].icon + ".png' alt='" + response.weather[0].main + "' />" )
        temp.text(response.main.temp);
        temp.append("&deg;F");
        humidity.text(response.main.humidity + "%");
        windSpeed.text(response.wind.speed + "MPH");

        var lat = response.coord.lat;
        var lon = response.coord.lon;


        var UVurl = "https://api.openweathermap.org/data/2.5/uvi?&lat=" + lat + "&lon=" + lon + "&appid=" + key;

        fetch(UVurl)
  .then(function (response) {
    return response.json();
        }).then(function(response){

            uvIndex.text(response.value);
        });

        var countryCode = response.sys.country;
        var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?&units=imperial&appid=" + key + "&lat=" + lat +  "&lon=" + lon;


        fetch(forecastURL)
  .then(function (response) {
    return response.json();
        }).then(function(response){
            console.log(response);
            $('#five-day-forecast').empty();
            for (var i = 1; i < response.list.length; i+=8) {

                var forecastDateString = dayjs(response.list[i].dt_txt).format("L");
                console.log(forecastDateString);

                var forecastCol = $("<div class='col-12 col-md-6 col-lg forecast-day mb-3'>");
                var forecastCard = $("<div class='card'>");
                var forecastCardBody = $("<div class='card-body'>");
                var forecastDate = $("<h5 class='card-title'>");
                var forecastIcon = $("<img>");
                var forecastTemp = $("<p class='card-text mb-0'>");
                var forecastHumidity = $("<p class='card-text mb-0'>");


                $('#five-day-forecast').append(forecastCol);
                forecastCol.append(forecastCard);
                forecastCard.append(forecastCardBody);

                forecastCardBody.append(forecastDate);
                forecastCardBody.append(forecastIcon);
                forecastCardBody.append(forecastTemp);
                forecastCardBody.append(forecastHumidity);

                forecastIcon.attr("src", "https://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png");
                forecastIcon.attr("alt", response.list[i].weather[0].main)
                forecastDate.text(forecastDateString);
                forecastTemp.text(response.list[i].main.temp);
                forecastTemp.prepend("Temp: ");
                forecastTemp.append("&deg;F");
                forecastHumidity.text(response.list[i].main.humidity);
                forecastHumidity.prepend("Humidity: ");
                forecastHumidity.append("%");



            }
        });

    });



};

cityButton.on("click", function(event){
    event.preventDefault();


    var searchValue = cityInput.val().trim();

    currentConditionsRequest(searchValue)

    cityInput.val(""); 
});

