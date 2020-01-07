
var authKey = "&appid=51c656b1b08b010750af1658413f8a67"

// URL Base
var queryUrlBase = 'https://api.openweathermap.org/data/2.5/weather?q='

var listSection = $('.list-group');
var city = $('#search-city')

// var searchCity = [];

var searchedCities = {
    cities: []
};

var searchedForecasts = {
    forecasts: []
}


$(document).ready(function() {
    var currentDate = moment().format('L')

    function getSession() {
     let cities = sessionStorage.getItem('lastOverview')
     let forecast = sessionStorage.getItem('lastForecast')
     console.log(cities)

     if(cities) {

        
        cities = JSON.parse(cities);
        searchedCities = cities
        if(cities.cities.length > 0) {

            renderWeather(cities.cities[0], true)
   
            cities.cities.forEach(function(index) {
                renderCitiesList(index)
            })
        }
     }

     if(forecast) {
        forecast = JSON.parse(forecast);
        searchedForecasts = forecast;

        console.log(cities, forecast)
       
        if(forecast.forecasts.length > 0) {
   
            renderForecast(forecast.forecasts[0])
        }
     }

    
    }

    getSession()

    // Ajax call for the current weather
    function currentWeather(city, fromStorage) {
         // create url for current weather
         var queryURL = queryUrlBase + city + "&units=imperial" + authKey;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {

            searchedCities.cities.push(response)

            sessionStorage.setItem('lastOverview', JSON.stringify(searchedCities));
            console.log(searchedCities)
           
            renderWeather(response, fromStorage)

        });
    }
    
    function renderWeather(response, fromStorage) {

        $('#main-card').empty()


        if(!fromStorage) {
            renderCitiesList(response)
        }

        // Create city name <h3> and append to card
        var cityTitle = $('<h3>');
        cityTitle.addClass('card-title');
        cityTitle.text(` ${response.name} (${moment().format('L')})`)
        // ${moment(data.list[i].dt_txt).format('L')}
        $('#main-card').append(cityTitle)

        // convert the temperature to variable
         var temperature = response.main.temp
        
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

          //UV Index API call and appending functionality
          var queryURLuv = `https://api.openweathermap.org/data/2.5/uvi/forecast?${authKey}&lat=${response.coord.lat}&lon=${response.coord.lon}&cnt=1`
          $.ajax({
              url: queryURLuv,
              method: "GET"
          })
          .then(function(resp) {
              var uvIndex = $('<p>');
              uvIndex.addClass('uv-index');
              uvIndex.text("UV Index: " + resp[0].value)
              windSpeed.append(uvIndex);
          });
       
    }

    function renderCitiesList(response) {

        var listSection = $('.list-group');
        $('#search-form').append(listSection);

        var listItems = $('<li>');
        listItems.addClass('list-group-item');
        listItems.text(response.name)
       
       listSection.prepend(listItems);
    }

      
    listSection.click(function(e){
        e.preventDefault()
        console.log('click')
        // $('#main-card').empty()
        // $('.card-deck').empty()
        elData = $(e.target).text();
        city.val('')

        currentWeather(elData, true)
        futureWeather(elData)
       
    });

    // function for ajax call to display 5 day forecast
    function futureWeather(city) {

        var dayCount = "&cnt=40"

        // variable for 5 day forecast url
        var queryUrlForecast = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + "&units=imperial" + dayCount + authKey;   
        $.ajax({
            url: queryUrlForecast,
            method: "GET"
        }).then(function(data) {
            console.log(data)

            searchedForecasts.forecasts.push(data)

            sessionStorage.setItem('lastForecast', JSON.stringify(searchedForecasts));

            renderForecast(data)     

        });
    }

    function renderForecast(data) {


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
            cardBody.addClass('card-body days');
            card.append(cardBody);
           
            // Create p tag to display date of each day
            var forecastDate = $('<p>');
            forecastDate.addClass('forecast-date')
           forecastDate.html(`${moment(data.list[i].dt_txt).format('L')}`)
           cardBody.append(forecastDate)

            // Create p tag to display temperature for each day
           var forecastTemp = $('<p>');
           forecastTemp.addClass('forecast-temp')
           forecastTemp.html(`Temp: ${data.list[i].main.temp} &#176;F`)
           forecastDate.append(forecastTemp)

           // Create p tag to display the humidity for each day
           var forecastHumid = $('<p>');
           forecastHumid.html(`Humidity: ${data.list[i].main.humidity} % `);
           forecastTemp.append(forecastHumid);

           // Create a img tag to display a icon for weather for each day
           var forecastIcon = $(`<img src="https://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png" alt="icon">`);
           forecastTemp.append(forecastIcon)
            
        }
    }


// click event that will trigger the ajax call for current and 5 day forecast
    $('#searchBtn').on('click', function(e) {
        e.preventDefault()
        var city = $('#search-city').val().trim()

        // Sends the ajax call the newly assembled url for the current forecast
        currentWeather(city);

        // Sends ajax call the newly assemeled url for the 5 day forecast
        futureWeather(city)

    });
});








