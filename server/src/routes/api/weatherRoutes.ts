import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', (req, res) => {
  // TODO: GET weather data from city name
  WeatherService.getWeatherForCity(req.body.cityName)
  .then((data) => {
    console.log('Line 13 route data', data);
    res.json(data);
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json({ message: err.message });
  });
  // TODO: save city to search history
  HistoryService.addCity(req.body.cityName)
  .then((city) => {
  res.json(city);
  });
});

// TODO: GET search history
router.get('/history', async (req, res) => {});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {});

export default router;
