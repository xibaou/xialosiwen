/*
 * by kaizel jskai
 * don't delete my wm
 * follow more on Instagram: @iqstore78
 */
const axios = require("axios");
const allowedApiKeys = require("../../declaration/arrayKey.jsx");

module.exports = async (req, res) => {
  const ip = req.query.ip || ""; // Parameter IP
  const apiKey = req.query.apiKey;

  if (!ip) {
    return res.status(400).json({
      error: "IP Address nya mana?",
    });
  }

  if (!apiKey || !allowedApiKeys.includes(apiKey)) {
    return res.status(403).json({
      error: "Input Parameter Apikey!",
    });
  }

  const ipLookupUrl = `https://ipapi.co/${ip}/json/`; // API untuk IP lookup

  try {
    const response = await axios.get(ipLookupUrl);
    const data = response.data;

    if (data.error) {
      return res.status(404).json({
        error: "IP Address tidak ditemukan!",
      });
    }

    res.status(200).json({
      "creator": "kaizel jskai", // Menambahkan creator di bagian atas
      "alamat_ip": data.ip,
      "kota": data.city || "Tidak tersedia",
      "wilayah": data.region || "Tidak tersedia",
      "negara": data.country_name || "Tidak tersedia",
      "kode_negara": data.country_code || "Tidak tersedia",
      "zona_waktu": data.timezone || "Tidak tersedia",
      "latitude": data.latitude || "Tidak tersedia",
      "longitude": data.longitude || "Tidak tersedia",
      "penyedia_layanan_internet": data.org || "Tidak tersedia",
    });
  } catch (error) {
    res.status(500).json({
      error: "Ada masalah, coba lagi nanti",
    });
  }
};
