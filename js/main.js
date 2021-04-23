const app = new Vue({
    el: "#app",
    data: {

    },
    methods: {
        getMetaWeatherAjax(method, data) {
            
            var apiUrl = "";

            switch (method) {
                case locSearch:

                    if (data.coords) {
                        apiUrl = "search/?lattlong=";
                        apiUrl += data.coords.lat + ',';
                        apiUrl += data.coords.long;
                    } else if (data.query) {
                        apiUrl = "search/?query=";
                        apiUrl += data.query;
                    }
                    
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
        },

        getCurrLoc() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((pos) => {
                    var lat = pos.coords.latitude;
                    var long = pos.coords.longitude;
                    getMetaWeatherAjax("locSearch", { coords: { lat, long } });
                });
            } else {
                // "Geolocation is not supported by this browser.";
            }
        }
    }
});
function


var name = "string";
name ;