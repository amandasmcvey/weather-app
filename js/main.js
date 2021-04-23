const app = new Vue({
    el: "#app",
    data: {

    }
});

function getMetaWeatherAjax(method, data) {
    
    var apiUrl = "";

    switch (method) {
        case locSearch:
            apiUrl = "search/?query=";
            break;
        case todayForecast:
            var todayDate = new Date();
            var dd = String(today.getDate());
            var mm = String(today.getMonth() + 1);
            var yyyy = today.getFullYear();

            todayDate = yyyy + '/' + mm + '/' + dd;
            apiUrl = data.woeid + "/" + todayDate;
            break;
    
        default:

            break;
    }

    $.ajax({
        url: "https://www.metaweather.com/api/location/" + apiUrl,
        method: 'GET',
        success: function (data) {
            if (method === "locSearch") {
                getMetaWeatherAjax("todayForecast", data);
            }
            
        },
        error: function(error){
            console.error(JSON.stringify(error));
        }
    });
}
