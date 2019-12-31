
var authKey = "&appid=51c656b1b08b010750af1658413f8a67"

// URL Base
var queryUrlBase = 'http://api.openweathermap.org/data/2.5/weather?q='


$(document).ready(function() {


    
    function runQuery(queryURL) {
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            console.log(response)
        })
    }





    $('#searchBtn').on('click', function(e) {
        e.preventDefault()
        var city = $('#search-city').val().trim()
        console.log(city)

        var newUrl = queryUrlBase + city + authKey;

        runQuery(newUrl);
   
    });
});







// 1. Get the user input fromt he search field and convert to variable
// 2. use the variables to create ajax calls