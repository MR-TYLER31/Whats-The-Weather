
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


    function futureWeather(queryUrlForecast) {
        $.ajax({
            url: queryUrlForecast,
            method: "GET"
        }).then(function(data) {
            console.log(data)

            $('.days').empty()
            
            for(var i = 0; i < data.list.length; i+= 8) {
                // console.log(data.list[i].weather[0].icon)
                console.log(data.list[i].main.temp)

                var card = $('<div>');
                card.addClass('card');
                $('.card-deck').append(card)
                var cardBody = $('<div>');
                cardBody.addClass('card-body');
                card.append(cardBody);
               

                var forecastDate = $('<p>');
               forecastDate.html(data.list[i].dt_txt)
               cardBody.append(forecastDate)


               var forecastTemp = $('<p>');
               forecastTemp.html(`Temp: ${data.list[i].main.temp} &#176;F`)
               forecastDate.append(forecastTemp)

               var forecastHumid = $('<p>');
               forecastHumid.html(`Humidity: ${data.list[i].main.humidity} % `);
               forecastTemp.append(forecastHumid);
                
            }

        });
    }


// click event that will trigger the ajax call for current and 5 day forecast
    $('#searchBtn').on('click', function(e) {
        e.preventDefault()
        var city = $('#search-city').val().trim()
        console.log(city)
        
        var newUrl = queryUrlBase + city + "&units=imperial" + authKey;

        var dayCount = "&cnt=40"

        var queryUrlForecast = 'http://api.openweathermap.org/data/2.5/forecast?q=' + city + "&units=imperial" + dayCount + authKey;

        // var numDays = 1;
        

        // Sends the ajax call the newly assembled url for the current forecast
        currentWeather(newUrl);

        futureWeather(queryUrlForecast)
   
    });
});








