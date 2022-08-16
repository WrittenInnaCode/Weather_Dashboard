
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

// Clicking on a city in search history displays current and future conditions for that city
$(document).on("click", ".list-group-item", function() {
    var listCity = $(this).text();
    fetchCoordinates(listCity);
});


function fetchWeather(data){
    let city = data.name
    
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + data.lat + "&lon=" + data.lon + "&units=imperial&exclude=minutely,hourly&appid=" + apiKey)
    .then((responce) => responce.json())
    .then((data) => {
        displayCurrentWeather(data.current, city)
        displayDailyWeather(data)
    })
}


// Today's weather forecast
function displayCurrentWeather(data, city){ 
    document.querySelector("#weatherHidden").classList.remove("d-none");
    document.querySelector("#forecastHeader").classList.remove("d-none");
    document.querySelector("#forecast").classList.remove("d-none");

        $(".dateToday").text(moment().format('MM/DD/YYYY')); // Today's date
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


// 5-day forecast 
function displayDailyWeather(data){ 

    for (let i = 0; i<5; i++){

        $("#dateForecast" + i).text(moment().add(i+1, "days").format('MM/DD/YYYY')); //Date for 5 days ahead

        let icon = data.daily[i].weather[0].icon;
        let temp = data.daily[i].temp.day;
        let humidity = data.daily[i].humidity;
        let speed = data.daily[i].wind_speed;


        document.querySelector("#icon" + i).src = "https://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector("#temp" + i).innerText = "Temperature: " + temp + "F";
        document.querySelector("#humidity" + i).innerText = "Humidity: " + humidity + "%";
        document.querySelector("#wind" + i).innerText = "Wind speed: " + speed + " mph";
    }
}



// search when clicked the search button
document.querySelector("#searchBtn").addEventListener("click", handleSubmit);



// search when "enter" key is pressed
document.querySelector(".input-area").addEventListener("keyup", function(event) {
    if (event.key == "Enter") {
        handleSubmit();
    }
});



