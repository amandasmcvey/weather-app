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
                case "locSearch":

                    if (data.coords) {
                        apiUrl = "search/?lattlong=";
                        apiUrl += data.coords.lat + ',';
                        apiUrl += data.coords.long;
                    } else if (data.query) {
                        apiUrl = "search/?query=";
                        apiUrl += data.query;
                    }
                    
                    break;
                case "todayForecast":

                    var todayDate = new Date();
                    var dd = String(todayDate.getDate());
                    var mm = String(todayDate.getMonth() + 1);
                    var yyyy = todayDate.getFullYear();

                    todayDate = yyyy + '/' + mm + '/' + dd;
                    apiUrl = data.woeid;
                    //+ "/" + todayDate;
                    break;
            
                default:

                    break;
            }
            //add error handling

            $.ajax({
                url: "https://desolate-shore-12077.herokuapp.com/https://www.metaweather.com/api/location/" + apiUrl,
                method: 'GET',
                success:(data) => {
                    if (data) {
                        switch (method) {
                            case "locSearch":
                                //data[0] is closest location to location name or coords entered
                                if (data[0]){
                                    this.getMetaWeatherAjax("todayForecast", { "woeid": data[0].woeid });
                                }
                                break;
                            
                            case "todayForecast":
                                //data.consolidated_weather[0] is latest weather available
                                this.locationName = data.title;
                                this.time = data.time;
                                this.date = data.consolidated_weather[0].applicable_date;
                                this.weather.desc = data.consolidated_weather[0].weather_state_name;
                                this.weather.abbr = data.consolidated_weather[0].weather_state_abbr;
                                this.weather.wind.speed = data.consolidated_weather[0].wind_speed;
                                this.weather.wind.dir = data.consolidated_weather[0].wind_direction;
                                this.weather.temp.curr = data.consolidated_weather[0].the_temp;
                                this.weather.temp.min = data.consolidated_weather[0].min_temp;
                                this.weather.temp.max = data.consolidated_weather[0].max_temp;
                                this.weather.airPressure = data.consolidated_weather[0].air_pressure;
                                this.weather.humidity = data.consolidated_weather[0].humidity;
                                this.weather.visibility = data.consolidated_weather[0].visibility;
                                this.weather.predictability = data.consolidated_weather[0].predictability;
                                break;
                        
                            default:

                                break;
                        }
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
                    this.getMetaWeatherAjax("locSearch", { "coords": { "lat": lat, "long": long } });
                });
            } else {
                // "Geolocation is not supported by this browser."
            }
    
            //add error handling
        }
    }
});