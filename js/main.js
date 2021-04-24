const app = new Vue({
    el: "#app",
    data: {
        locationName: "",
        coords: {
            lat: "",
            long: ""
        },
        time: "",
        date: "",
        weather: {
            desc: "",
            abbr: "",
            wind: {
                speed: "",
                dir: ""
            },
            temp: {
                curr: "",
                min: "",
                max: ""
            },
            airPressure: "",
            humidity: "",
            visibility: "",
            predictability: ""
        }
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
            //add error handling

            $.ajax({
                url: "https://www.metaweather.com/api/location/" + apiUrl,
                method: 'GET',
                success: function (data) {
                    switch (method) {
                        case locSearch:

                            getMetaWeatherAjax("todayForecast", {"woeid": woeid});                           
                            break;
                        
                        case todayForecast:
                            this.locationName = data.title;
                            this.time = data.time;
                            this.date = data.consolidated_weather.applicable_date;
                            this.weather.desc = data.consolidated_weather.weather_state_name;
                            this.weather.abbr = data.consolidated_weather.weather_state_abbr;
                            this.weather.wind.speed = data.consolidated_weather.wind_speed;
                            this.weather.wind.dir = data.consolidated_weather.wind_direction;
                            this.weather.temp.curr = data.consolidated_weather.the_temp;
                            this.weather.temp.min = data.consolidated_weather.min_temp;
                            this.weather.temp.max = data.consolidated_weather.max_temp;
                            this.weather.airPressure = data.consolidated_weather.air_pressure;
                            this.weather.humidity = data.consolidated_weather.humidity;
                            this.weather.visibility = data.consolidated_weather.visibility; 
                            this.weather.predictability = data.consolidated_weather.predictability;
                            break;
                    
                        default:

                            break;
                    }
                    //add error handling                
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
                    getMetaWeatherAjax("locSearch", { "coords": { "lat": lat, "long": long } });
                });
            } else {
                // "Geolocation is not supported by this browser."
            }
    
            //add error handling
        }
    }
});