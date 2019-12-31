
var authKey = "&appid=51c656b1b08b010750af1658413f8a67"

// URL Base
var queryUrlBase = 'http://api.openweathermap.org/data/2.5/weather?q='


$(document).ready(function() {

    // Ajax call for the current weather
    function currentWeather(queryURL) {
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            console.log(response)
           

            $('#main-card').empty()

            // Create city name <h3> and append to card
            var cityTitle = $('<h3>');
            cityTitle.addClass('card-title');
            cityTitle.text(response.name)
            $('#main-card').append(cityTitle)

            // convert the temperature to farenheit
            var temperature = (response.main.temp - 273.15) * 1.80 + 32; 
            
            var currentTemp = $('<p>');
            currentTemp.addClass('temperature');
            var t = temperature.toString()
            var temp = t.slice(0,4)
            currentTemp.html(`Temperature: ${temp}  &#176; F`);
            cityTitle.append(currentTemp)
            
            console.log(temp)

        });
    }




// click event that will trigger the ajax call for current and 5 day forecast
    $('#searchBtn').on('click', function(e) {
        e.preventDefault()
        var city = $('#search-city').val().trim()
        console.log(city)
        
        var newUrl = queryUrlBase + city + authKey;

        // Sends the ajax call the newly assembled url for the current forecast
        currentWeather(newUrl);
   
    });
});







// 1. Get the user input fromt he search field and convert to variable
// 2. use the variables to create ajax calls