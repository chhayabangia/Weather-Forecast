import * as fs from 'fs/promises';
// TODO: Define a City class with name and id properties
class City {
    constructor(name, id) {
        this.name = name;
        this.id = id;
    }
}
// TODO: Complete the HistoryService class
class HistoryService {
    // TODO: Define a read method that reads from the searchHistory.json file
    async read() {
        return await fs.readFile('db/db.json', {
            flag: 'a+',
            encoding: 'utf8',
        });
    }
    // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
    async write(cities) {
        return await fs.writeFile('db/db.json', JSON.stringify(cities, null, 2));
    }
    // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
    async getCities() {
        const cities = await this.read();
        return JSON.parse(cities);
    }
    // TODO Define an addCity method that adds a city to the searchHistory.json file
    async addCity(city) {
        const cities = await this.getCities();
        const newCity = new City(city, (cities.length + 1).toString());
        cities.push(newCity);
        await this.write(cities);
        return newCity;
    }
    // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
    async removeCity(id) {
        const cities = await this.getCities();
        const index = cities.findIndex((city) => city.id === id);
        if (index === -1) {
            throw new Error('City not found');
        }
        const city = cities.splice(index, 1)[0];
        await this.write(cities);
        return city;
    }
}
export default new HistoryService();
