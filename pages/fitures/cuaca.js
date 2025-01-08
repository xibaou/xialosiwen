/*
 * by kaizel jskai
 * don't delete my wm
 * follow more on Instagram: @iqstore78
 */
const allowedApiKeys = require("../../declaration/arrayKey.jsx");

module.exports = async (req, res) => {
  const city = req.query.city || ""; // Parameter untuk nama kota
  const apiKey = req.query.apiKey;

  if (!city) {
    return res.status(400).json({
      error: "Kota apa?",
    });
  }

  if (!apiKey || !allowedApiKeys.includes(apiKey)) {
    return res.status(403).json({
      error: "Input Parameter Apikey!",
    });
  }

  const weatherApiKey = "060a6bcfa19809c2cd4d97a212b19273"; // API key OpenWeatherMap
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${weatherApiKey}&lang=id`;

  try {
    const response = await fetch(weatherUrl);
    if (!response.ok) {
      return res.status(404).json({
        error: "Kota tidak ditemukan!",
      });
    }
    const data = await response.json();

    res.status(200).json({
      "kota": data.name,
      "negara": data.sys.country,
      "suhu": `${data.main.temp}°C`,
      "deskripsi": data.weather[0].description,
      "kelembaban": `${data.main.humidity}%`,
      "kecepatan_angin": `${data.wind.speed} m/s`,
    });
  } catch (error) {
    res.status(500).json({
      error: "Ada masalah, coba lagi nanti",
    });
  }
};
