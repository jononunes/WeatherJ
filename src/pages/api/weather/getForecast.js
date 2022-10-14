import axios from "axios";

const fetchForecast = async (req, res) => {
  const data = await axios.get(
    "https://api.openweathermap.org/data/2.5/forecast",
    {
      params: {
        lat: req.query.lat,
        lon: req.query.lon,
        appid: process.env.WEATHER_API_KEY,
        units: req.query.unit,
      },
    }
  );

  return res.status(200).json(data.data);
};

export default fetchForecast;
