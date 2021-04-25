const app = new Vue({
    el: "#app",
    data: {
        locationNameInput: "",
        locationNameOutput: "",
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
        getMetaWeatherAjax(data) {
            var apiUrl = "";

            if (data.woeid) {
                $("#weatherDiv").slideUp();
                //if (data.woeid) === true, we have location ID and can request weather
                apiUrl = data.woeid;
            } else if (data.coords) {
                //if have coordinates from geo locator (func getCurrLoc), need to request location ID (woeid)
                apiUrl = "search/?lattlong=";
                apiUrl += data.coords.lat + ',';
                apiUrl += data.coords.long;
            } else if (this.locationNameInput) {
                //if have query from DOM input (searchInput), need to request location ID (woeid)
                apiUrl = "search/?query=";
                apiUrl += this.locationNameInput;
            } else {
                //if no woeid or query provided, default to local weather
                this.getCurrLoc();
                return;
            }

            $.ajax({
                url: "https://desolate-shore-12077.herokuapp.com/https://www.metaweather.com/api/location/" + apiUrl,
                method: 'GET',
                success:(response) => {
                    if (response) {
                        if (data.woeid && response.consolidated_weather[0]) {
                            //if (data.woeid) === true, we requested weather data and expect such in response
                            //response.consolidated_weather[0] is latest weather available
                            this.locationNameOutput = response.title;
                            this.time = response.time;
                            this.date = response.consolidated_weather[0].applicable_date;
                            this.weather.desc = response.consolidated_weather[0].weather_state_name;
                            this.weather.abbr = response.consolidated_weather[0].weather_state_abbr;
                            this.weather.wind.speed = response.consolidated_weather[0].wind_speed;
                            this.weather.wind.dir = response.consolidated_weather[0].wind_direction;
                            this.weather.temp.curr = response.consolidated_weather[0].the_temp.toFixed(1);
                            this.weather.temp.min = response.consolidated_weather[0].min_temp.toFixed(1);
                            this.weather.temp.max = response.consolidated_weather[0].max_temp.toFixed(1);
                            this.weather.airPressure = response.consolidated_weather[0].air_pressure;
                            this.weather.humidity = response.consolidated_weather[0].humidity;
                            this.weather.visibility = response.consolidated_weather[0].visibility;
                            this.weather.predictability = response.consolidated_weather[0].predictability;

                            $("#weatherDiv").slideDown();
                        } else if (response[0] && (data.coords || this.locationNameInput)) {
                             //if have coordinates from geo locator or query from DOM input, we requested location ID (woeid)
                            //can now request weather data using weather ID 
                            //response[0] is closest location to location name or coords entered
                            this.getMetaWeatherAjax({ "woeid": response[0].woeid });
                        } else {
                            //if no response, try requesting local weather
                            this.getCurrLoc();
                        }
                    } else {
                        //if no response, try requesting local weather
                        this.getCurrLoc();
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
                    this.getMetaWeatherAjax({ "coords": { "lat": lat, "long": long } });
                });
            } else {
                console.error("Geolocation is not supported by this browser.");
                //default to Dallas
                this.locationNameInput = "Dallas";
                this.getMetaWeatherAjax({ "woeid": 2388929 });
            }
        }
    }
});
