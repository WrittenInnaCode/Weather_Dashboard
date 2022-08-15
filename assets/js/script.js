
let apiKey = "14bb101d6d98d31ec399f418b5fd6c8a"
let searchHistory = [];

function fetchCoordinates(city) {
    fetch("https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=5&appid=" + apiKey)
.then((responce) => responce.json())
.then((data) => fetchWeather(data[0]));
}

function handleSubmit(event) { // when the search button is activated
    let city = $("#enterCity").val();
    fetchCoordinates(city);

    if (!searchHistory.includes(city)) { // check local storage; if not in storage, add a searched city list
        searchHistory.push(city);
        var searchedCity = $(`<button type="button" class="list-group-item list-group-item-action list-group-item-primary"> ${city} </button>`);
        $("#searchHistory").append(searchedCity);
    };
    
    localStorage.setItem("city", JSON.stringify(searchHistory));
    // console.log(searchHistory);
}



function fetchWeather(data){
    let city = data.name
    
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + data.lat + "&lon=" + data.lon + "&units=imperial&exclude=minutely,hourly&appid=" + apiKey)
    .then((responce) => responce.json())
    .then((data) => displayCurrentWeather(data.current, city)) 
}



function displayCurrentWeather(data, city){
    document.querySelector("#weatherHidden").classList.remove("d-none");
    document.querySelector("#forecastHeader").classList.remove("d-none");
    document.querySelector("#forecast").classList.remove("d-none");

        $(".dateToday").text(moment().format('MM/DD/YYYY'));
        const name = city;
        const icon = data.weather[0].icon;
        const temp = data.temp;
        const humidity = data.humidity;
        const speed = data.wind_speed;
        const uvi = data.uvi;
        document.querySelector(".city").innerText = name;
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector(".temp").innerText = "Temperature: " + temp + "F";
        document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
        document.querySelector(".wind").innerText = "Wind speed: " + speed + " mph";
        document.querySelector(".uvIndex").innerText = "UV Index: " + uvi;
        

        // color-code the UV index
        if (uvi >= 0 && uvi <= 2.99) {
            $(".uvIndex").css("background-color", "#38ad24").css("color", "white"); //green
        } else if (uvi >= 3 && uvi <= 5.99) {
            $(".uvIndex").css("background-color", "#FFF300").css("color", "grey"); //yellow
        } else if (uvi >= 6 && uvi <= 7.99) {
            $(".uvIndex").css("background-color", "#FFA500").css("color", "white"); //orange
        } else if (uvi >= 8 && uvi <= 10.99) {
            $(".uvIndex").css("background-color", "#ff0000").css("color", "white"); //red
        }; 
}




// search when clicked the search button
document.querySelector("#searchBtn").addEventListener("click", handleSubmit);



// search when "enter" key is pressed
document.querySelector(".input-area").addEventListener("keyup", function(event) {
    if (event.key == "Enter") {
        handleSubmit();
    }
});

// Clicking on a city in search history displays current and future conditions for that city
$(document).on("click", ".list-group-item", function() {
    var listCity = $(this).text();
    fetchCoordinates(listCity);
});




