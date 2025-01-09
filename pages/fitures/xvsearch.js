/*
 * by kaizel jskai
 * don't delete my wm
 * follow more on Instagram: @iqstore78
 */

const { xvideosSearch } = require("api-dylux"); // Import dari module api-dylux
const allowedApiKeys = require("../../declaration/arrayKey.jsx"); // Tempatkan daftar API keys yang diperbolehkan

module.exports = async (req, res) => {
  const query = req.query.query || ""; // Query pencarian
  const apiKey = req.query.apiKey; // API Key untuk autentikasi
  const limit = req.query.limit || 5; // Batas jumlah hasil pencarian (default: 5)

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

  try {
    // Memanggil fungsi pencarian dari api-dylux
    const results = await xvideosSearch(query);

    if (results.length === 0) {
      return res.status(404).json({
        error: "Hasil pencarian tidak ditemukan!",
      });
    }

    // Menyusun hasil pencarian dengan batas limit
    const responseResults = results.slice(0, limit).map((item) => ({
      title: item.title,
      duration: item.duration,
      link: item.link,
      views: item.views,
      thumb: item.thumb,
    }));

    // Mengirimkan hasil pencarian dengan informasi creator di atas
    return res.status(200).json({
      creator: "kaizel jskai",
      query: query,
      results: responseResults,
    });
  } catch (error) {
    res.status(500).json({
      error: "Terjadi kesalahan dalam pencarian xvideos.",
    });
  }
};