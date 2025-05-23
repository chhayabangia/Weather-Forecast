import dayjs from 'dayjs';
import dotenv from 'dotenv';
// import dayjs,{type Dayjs} from 'dayjs';
dotenv.config();
// TODO: Define a class for the Weather object
class Weather {
    constructor(city, date, tempF, feelsLike, humidity, windSpeed, iconDescription, icon) {
        this.city = city;
        this.date = date;
        this.tempF = tempF;
        this.feelsLike = feelsLike;
        this.humidity = humidity;
        this.windSpeed = windSpeed;
        this.icon = icon;
        this.iconDescription = iconDescription;
    }
}
// TODO: Complete the WeatherService class
class WeatherService {
    constructor() {
        this.baseURL = process.env.API_BASE_URL || 'https://api.openweathermap.org';
        this.apiKey = process.env.API_KEY || '';
        this.cityName = '';
    }
    // TODO: Create fetchLocationData method
    async fetchLocationData(query) {
        try {
            if (!this.baseURL || !this.apiKey) {
                throw new Error('Missing API key or base URL');
            }
            const response = await fetch(query);
            const data = await response.json();
            console.log("Line 63 Fetch location data", data);
            return data[0];
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
    // TODO: Create destructureLocationData method
    destructureLocationData(locationData) {
        if (!locationData) {
            throw new Error('Location data not found');
        }
        // console.log("Line 76 destructure location data",locationData);
        const { lat, lon, name, state, country } = locationData;
        const coordinates = { lat, lon, name, state, country };
        return coordinates;
    }
    // TODO: Create buildGeocodeQuery method
    buildGeocodeQuery() {
        const geoCode = `${this.baseURL}/geo/1.0/direct?q=${this.cityName}&limit=5&appid=${this.apiKey}`;
        return geoCode;
    }
    // TODO: Create buildWeatherQuery method
    buildWeatherQuery(coordinates) {
        const weatherQuery = `${this.baseURL}/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=imperial`;
        return weatherQuery;
    }
    // TODO: Create fetchAndDestructureLocationData method 
    // did from here
    async fetchAndDestructureLocationData() {
        const query = this.buildGeocodeQuery();
        // console.log("Line 95 - fetch and destructure location data", query);
        const locationData = await this.fetchLocationData(query);
        // console.log("Line 97",locationData);
        return this.destructureLocationData(locationData);
    }
    // TODO: Create fetchWeatherData method
    async fetchWeatherData(coordinates) {
        const query = this.buildWeatherQuery(coordinates);
        // console.log("Line 102 Fetch weather data", query);
        const response = await fetch(query);
        const data = await response.json();
        console.log("Line 114", data);
        return data;
    }
    // TODO: Build parseCurrentWeather method
    parseCurrentWeather(response) {
        console.log("Line 111", response);
        const { temp, feels_like, humidity } = response.main;
        const { dt } = response.dt;
        const { speed } = response.wind;
        const { iconDescription, icon } = response.weather[0];
        return new Weather(this.cityName, dayjs(dt).format('M/D/YYYY'), temp, feels_like, humidity, speed, iconDescription, icon);
    }
    //  city: string;
    // date: Dayjs | string;
    // tempF: number;
    // feelsLike: number;
    // humidity: number;
    // windSpeed: number;
    // icon: string;
    // iconDescription: string;
    // TODO: Complete buildForecastArray method
    buildForecastArray(currentWeather, weatherData) {
        const forecastArray = [currentWeather];
        for (let i = 0; i < weatherData.length; i++) {
            const { temp, feels_like, humidity } = weatherData[i].main;
            const dt = weatherData[i].dt;
            console.log("THIS IS THE DATE", dayjs(dt * 1000).format('M/D/YYYY'));
            console.log(dt);
            const { speed } = weatherData[i].wind;
            const { iconDescription, icon } = weatherData[i].weather[0];
            const weather = new Weather(this.cityName, dayjs(dt * 1000).format('M/D/YYYY'), temp, feels_like, humidity, speed, iconDescription, icon);
            forecastArray.push(weather);
        }
        return forecastArray;
    }
    async fetchForecastData(coordinates) {
        const query = `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=imperial`;
        const response = await fetch(query);
        const data = await response.json();
        console.log("Line 134", data);
        const filteredData = data.list.filter((weather) => {
            return weather.dt_txt.includes("09:00:00");
        });
        return filteredData;
    }
    // TODO: Complete getWeatherForCity method
    async getWeatherForCity(city) {
        this.cityName = city;
        const coordinates = await this.fetchAndDestructureLocationData();
        const weatherData = await this.fetchWeatherData(coordinates);
        const currentWeather = this.parseCurrentWeather(weatherData);
        // console.log("Line 134", currentWeather);
        const forecastData = await this.fetchForecastData(coordinates);
        // console.log(forecastData)
        const forecastArray = this.buildForecastArray(currentWeather, forecastData);
        return forecastArray;
    }
}
export default new WeatherService();
