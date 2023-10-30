const key = "c30ab354a125069f3c860338a8a1704d"
const api = "api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}"
let cities = []

let City = $("#current-city");
const temp = $("#current-temp");
const humidity = $("#current-humidity");
const windSpeed = $("#current-wind-speed");
const uvIndex = $("#uv-index");

let historyList = $('#search-history-list');
let cityInput = $("#search-city");
let cityButton = $("#search-city-button");
let clearButton = $("#clear-history");

var weatherContent = $("#weather-content");

var date = dayjs().format("MM/D/YYYY")

$(document).on("submit", function(){
    event.preventDefault();


    var searchValue = cityInput.val().trim();

    search(searchValue)
    searchHistory(searchValue);
    cityInput.val(""); 
});


function search(searchValue) {


    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&units=imperial&appid=" + key;


    fetch(queryURL)
    .then(function (response) {
      return response.json();
    }).then(function(response){
        console.log(response);
        City.text(response.name);
        City.append("<small class='text-muted' id='current-date'>");
        $("#current-date").text("(" + date + ")");
        City.append("<img src='https://openweathermap.org/img/w/" + response.weather[0].icon + ".png' alt='" + response.weather[0].main + "' />" )
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

                let forecastDateString = dayjs(response.list[i].dt_txt).format("MM/D/YYYY");
                console.log(forecastDateString);

                let CurrCol = $("<div class='col-12 col-md-6 col-lg forecast-day mb-3'>");
                let CurrCard = $("<div class='card'>");
                let CurrCardBody = $("<div class='card-body'>");
                let CurrDate = $("<h5 class='card-title'>");
                let CurrIcon = $("<img>");
                let CurrTemp = $("<p class='card-text mb-0'>");
                let CurrHumidity = $("<p class='card-text mb-0'>");


                $('#five-day-forecast').append(CurrCol);
                CurrCol.append(CurrCard);
                CurrCard.append(CurrCardBody);

                CurrCardBody.append(CurrDate);
                CurrCardBody.append(CurrIcon);
                CurrCardBody.append(CurrTemp);
                CurrCardBody.append(CurrHumidity);

                CurrIcon.attr("src", "https://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png");
                CurrIcon.attr("alt", response.list[i].weather[0].main)
                CurrDate.text(forecastDateString);
                CurrTemp.text(response.list[i].main.temp);
                CurrTemp.prepend("Temp: ");
                CurrTemp.append("&deg;F");
                CurrHumidity.text(response.list[i].main.humidity);
                CurrHumidity.prepend("Humidity: ");
                CurrHumidity.append("%");



            }
        });

    });



};

cityButton.on("click", function(event){
    event.preventDefault();


    var searchValue = cityInput.val().trim();

    search(searchValue)

    cityInput.val(""); 
});


function searchHistory(searchValue) {

    if (searchValue) {

        if (cities.indexOf(searchValue) === -1) {
            cities.push(searchValue);


            listArray();
            clearButton.removeClass("hide");
            weatherContent.removeClass("hide");
        } else {

            var removeIndex = cities.indexOf(searchValue);
            cities.splice(removeIndex, 1);


            cities.push(searchValue);


            listArray();
            clearButton.removeClass("hide");
            weatherContent.removeClass("hide");
        }
    }

}

function listArray() {

historyList.empty();


    cities.forEach(function(city){
        var searchHistoryItem = $('<li class="list-group-item city-btn">');
        searchHistoryItem.attr("data-value", city);
        searchHistoryItem.text(city);
        historyList.prepend(searchHistoryItem);
    });

    localStorage.setItem("cities", JSON.stringify(cities));

}

function reload() {
    if (localStorage.getItem("cities")) {
        cities = JSON.parse(localStorage.getItem("cities"));
        var lastIndex = cities.length - 1;

        listArray();

        if (cities.length !== 0) {
            search(cities[lastIndex]);
            weatherContent.removeClass("hide");
        }
    }
}

reload();

clearButton.on("click", function(){
    
    cities = [];
    
    listArray();
    
    $(this).addClass("hide");
});

function showClear() {
    if (historyList.text() !== "") {
        clearButton.removeClass("hide");
    }
}

showClear()

historyList.on("click","li.city-btn", function(event) {
    
    var value = $(this).data("value");
    search(value);
    searchHistory(value); 

});
