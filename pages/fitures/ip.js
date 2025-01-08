const axios = require("axios");
const allowedApiKeys = require("../../declaration/arrayKey.jsx");

module.exports = async (req, res) => {
  const ip = req.query.ip || ""; // Parameter IP
  const apiKey = req.query.apiKey;

  if (!ip) {
    return res.status(400).json({
      error: "Harap masukkan alamat IP!",
    });
  }

  if (!apiKey || !allowedApiKeys.includes(apiKey)) {
    return res.status(403).json({
      error: "API Key tidak valid atau tidak disertakan!",
    });
  }

  const ipLookupUrl = `https://ipapi.co/${ip}/json/`; // API untuk IP lookup
  const weatherApiKey = "060a6bcfa19809c2cd4d97a212b19273"; // OpenWeatherMap API Key

  try {
    // Mendapatkan data IP
    const response = await axios.get(ipLookupUrl);
    if (response.status !== 200) {
      return res.status(response.status).json({
        error: "Gagal mendapatkan data dari layanan IP lookup.",
      });
    }

    const data = response.data;

    // Mendapatkan kondisi cuaca berdasarkan lokasi
    let weatherData = null;
    if (data.latitude && data.longitude) {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${data.latitude}&lon=${data.longitude}&appid=${weatherApiKey}&units=metric`;
      const weatherResponse = await axios.get(weatherUrl);
      weatherData = weatherResponse.data;
    }

    res.status(200).json({
      creator: "kaizel jskai", // Metadata creator
      alamat_ip: data.ip || "Tidak tersedia",
      kota: data.city || "Tidak tersedia",
      wilayah: data.region || "Tidak tersedia",
      negara: data.country_name || "Tidak tersedia",
      kode_negara: data.country_code || "Tidak tersedia",
      zona_waktu: data.timezone || "Tidak tersedia",
      latitude: data.latitude || "Tidak tersedia",
      longitude: data.longitude || "Tidak tersedia",
      penyedia_layanan_internet: data.org || "Tidak tersedia",
      is_vpn: data.security ? data.security.is_vpn : "Tidak tersedia",
      peta_lokasi: data.latitude && data.longitude 
        ? `https://www.google.com/maps?q=${data.latitude},${data.longitude}`
        : "Tidak tersedia",
      cuaca: weatherData 
        ? {
            deskripsi: weatherData.weather[0].description,
            suhu: weatherData.main.temp,
            kelembapan: weatherData.main.humidity,
          }
        : "Tidak tersedia",
    });
  } catch (error) {
    if (error.response) {
      // Error dari API eksternal
      res.status(error.response.status).json({
        error: `Layanan bermasalah: ${error.response.statusText}`,
      });
    } else if (error.request) {
      // Error jaringan
      res.status(503).json({
        error: "Tidak dapat terhubung ke layanan eksternal. Coba lagi nanti.",
      });
    } else {
      // Error lainnya
      res.status(500).json({
        error: "Terjadi kesalahan internal pada server.",
      });
    }
  }
};
