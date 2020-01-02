
var authKey = "&appid=51c656b1b08b010750af1658413f8a67"

// URL Base
var queryUrlBase = 'http://api.openweathermap.org/data/2.5/weather?q='




$(document).ready(function() {
    var currentDate = moment().format('L')

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
            cityTitle.text(` ${response.name} (${currentDate})`)
            $('#main-card').append(cityTitle)

            // convert the temperature to variable
             var temperature = response.main.temp //- 273.15) * 1.80 + 32; 
            
            // Add <p> to display the temperature and append to city name
            var currentTemp = $('<p>');
            currentTemp.addClass('temperature');
            var t = temperature.toString()
            var temp = t.slice(0,4)
            currentTemp.html(`Temperature: ${temp}  &#176; F`);
            cityTitle.append(currentTemp)
             console.log(temp)

             // Add <p> to display the humidity and append to the temperature
             var currentHumidity = $('<p>');
            currentHumidity.addClass('humidity');
            currentHumidity.html(`Humidity: ${response.main.humidity} %`);
            currentTemp.append(currentHumidity)
            console.log(response.main.humidity)

             // Add <p> to display the wind speed and append to the humidity
            var windSpeed = $('<p>');
            windSpeed.addClass('wind-speed');
            windSpeed.html(`Wind Speed: ${response.wind.speed} MPH`);
            currentHumidity.append(windSpeed)
            console.log(response.wind.speed)

             // Add <p> to display the UV index and append to the wind speed
             var uvIndex = $('<p>');
             uvIndex.addClass('uv-index');
             uvIndex.html(`UV Index: ${response.coord.lon}`);
             windSpeed.append(uvIndex)
             console.log(response.coord)

        });
    }


    // function for ajax call to display 5 day forecast
    function futureWeather(queryUrlForecast) {
        $.ajax({
            url: queryUrlForecast,
            method: "GET"
        }).then(function(data) {
            console.log(data)

            // Empties out current cards on page load
            $('.card-deck').empty()
            
            // Loops througn 5 day forecast 
            for(var i = 0; i < data.list.length; i+= 8) {
                
                // console.log(data.list[i].weather[0].icon)
                console.log(data.list[i].main.temp)

                // Creates card for each of the 5 days
                var card = $('<div>');
                card.addClass('card');
                $('.card-deck').append(card)
                var cardBody = $('<div>');
                cardBody.addClass('card-body');
                card.append(cardBody);
               

                // Create p tag to display date of each day
                var forecastDate = $('<p>');
               forecastDate.html(`${moment(data.list[i].dt_txt).format('L')}`)
               cardBody.append(forecastDate)

             

                // Create p tag to display temperature for each day
               var forecastTemp = $('<p>');
               forecastTemp.html(`Temp: ${data.list[i].main.temp} &#176;F`)
               forecastDate.append(forecastTemp)

               // Create p tag to display the humidity for each day
               var forecastHumid = $('<p>');
               forecastHumid.html(`Humidity: ${data.list[i].main.humidity} % `);
               forecastTemp.append(forecastHumid);

               // Create a img tag to display a icon for weather for each day
               var forecastIcon = $(`<img src="http://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png" alt="icon">`);
               //    forecastDate.attr(`src`, data.list[i].weather[0].icon)
                  forecastTemp.append(forecastIcon)
                
            }

        });
    }


// click event that will trigger the ajax call for current and 5 day forecast
    $('#searchBtn').on('click', function(e) {
        e.preventDefault()
        var city = $('#search-city').val().trim()
        console.log(city)
        
        // create url for current weather
        var newUrl = queryUrlBase + city + "&units=imperial" + authKey;

        var dayCount = "&cnt=40"

        // variable for 5 day forecast url
        var queryUrlForecast = 'http://api.openweathermap.org/data/2.5/forecast?q=' + city + "&units=imperial" + dayCount + authKey;

        

        // Sends the ajax call the newly assembled url for the current forecast
        currentWeather(newUrl);

        // Sends ajax call the newly assemeled url for the 5 day forecast
        futureWeather(queryUrlForecast)
   
    });
});








