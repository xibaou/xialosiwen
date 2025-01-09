/*
 * by kaizel jskai
 * don't delete my wm
 * follow more on Instagram: @iqstore78
 */

const gis = require('g-i-s');
const allowedApiKeys = require("../../declaration/arrayKey.jsx"); // Tempatkan daftar API keys yang diperbolehkan

module.exports = async (req, res) => {
  const query = req.query.query || "";  // Query pencarian
  const apiKey = req.query.apiKey; // API Key untuk autentikasi

  // Memastikan query tidak kosong
  if (!query) {
    return res.status(400).json({
      error: "Query pencarian diperlukan!",
    });
  }

  // Memastikan API key valid
  if (!apiKey || !allowedApiKeys.includes(apiKey)) {
    return res.status(403).json({
      error: "Input Parameter Apikey!",
    });
  }

  // Melakukan pencarian gambar menggunakan g-i-s
  gis(query, function (error, result) {
    if (error) {
      return res.status(500).json({
        error: "Terjadi kesalahan dalam pencarian gambar.",
      });
    }

    if (!result || result.length === 0) {
      return res.status(404).json({
        error: "Hasil pencarian tidak ditemukan!",
      });
    }

    // Menyusun hasil pencarian dengan menambahkan watermark
    const results = result.map(item => ({
      title: item.title,
      link: item.url,
      snippet: item.snippet,
      image: item.url,
      watermark: ["kaizel jskai", "kaisjs"],  // Menambahkan watermark
    }));

    // Mengirimkan hasil pencarian dengan watermark
    res.status(200).json({
      query: query,
      results: results,
    });
  });
};
