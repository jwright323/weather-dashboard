
var apiKey = "619893740c3f9488e288b4750aa68209";
var currentWeather = $("#currentWeather");
var theForecast = $("#weatherForecast");
var theCities;
// City search 
$("#submitCity").click(function() {
    event.preventDefault();
    var cityName = $("#cityInput").val();
    returnCurrentWeather(cityName);
    returntheForecast(cityName);
});
// Previous Citys show under search 
$("#previousSearch").click(function() {
    var cityName = event.target.value;
    returnCurrentWeather(cityName);
    returntheForecast(cityName);
})
if (localStorage.getItem("weatherSearches")) {
    theCities = JSON.parse(localStorage.getItem("weatherSearches"));
    writeSearchHistory(theCities);
} else {
    theCities = [];
};
//Clear local storage
$("#clear").click(function() {
    localStorage.clear('weatherSearches');
});
// API call for City/date data
function returnCurrentWeather(cityName) {
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&APPID=${apiKey}`;
    $.get(queryURL).then(function(response){
        var currentTime = new Date(response.dt*1000);
        var weatherIcon = `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`;
        currentWeather.html(`
        <h2>${response.name}, ${response.sys.country} (${currentTime.getMonth()+1}/${currentTime.getDate()}/${currentTime.getFullYear()})<img src=${weatherIcon} height="70px"></h2>
        <p>Temperature: ${response.main.temp}&#176;F</p>
        <p>Humidity: ${response.main.humidity}%</p>
        <p>Wind Speed: ${response.wind.speed} mph</p>
        `, returnUVIndex(response.coord))
        createHistoryButton(response.name);
    })
};
// API call for 5 day weather forecast
function returntheForecast(cityName) {
    var queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&APPID=6c0ac38b22e3e819b50460a5a899f855`;
    $.get(queryURL).then(function(response){
        var forecastInfo = response.list;
        theForecast.empty();
        $.each(forecastInfo, function(i) {
            if (!forecastInfo[i].dt_txt.includes("12:00:00")) {
                return;
            }
            var forecastDate = new Date(forecastInfo[i].dt*1000);
            var weatherIcon = `https://openweathermap.org/img/wn/${forecastInfo[i].weather[0].icon}.png`;
            theForecast.append(`
            <div class="col-md">
                <div class="card text-white bg-primary">
                    <div class="card-body">
                        <h4>${forecastDate.getMonth()+1}/${forecastDate.getDate()}/${forecastDate.getFullYear()}</h4>
                        <img src=${weatherIcon} alt="Icon">
                        <p>Temp: ${forecastInfo[i].main.temp}&#176;F</p>
                        <p>Humidity: ${forecastInfo[i].main.humidity}%</p>
                    </div>
                </div>
            </div>
            `)
        })
    })
};
// UV Index
function returnUVIndex(coordinates) {
    var queryURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${coordinates.lat}&lon=${coordinates.lon}&APPID=${apiKey}`;
    $.get(queryURL).then(function(response){
        var currUVIndex = response.value;
        var uvSeverity = "green";
        weatherRightNow.append(`<p>UV Index: <span class="uvPadding" style="background-color: ${uvSeverity};">${currUVIndex}</span></p>`);
    })
}
// Recent search history
function createHistoryButton(cityName) {
    var citySearch = cityName.trim();
    var buttonCheck = $(`#previousSearch > BUTTON[value='${citySearch}']`);
    if (buttonCheck.length == 1) {
      return;
    }
    if (!theCities.includes(cityName)){
        theCities.push(cityName);
        localStorage.setItem("weatherSearches", JSON.stringify(theCities));
    }
    $("#previousSearch").prepend(`
    <button class="btn btn-light cityHistoryBtn" value='${cityName}'>${cityName}</button>
    `);
}
function writeSearchHistory(array) {
    $.each(array, function(i) {
        createHistoryButton(array[i]);
    })
}
