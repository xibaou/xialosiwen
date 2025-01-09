/*
 * by kaizel jskai
 * don't delete my wm
 * follow more on Instagram: @iqstore78
 */

const axios = require('axios');
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
    // URL API Wikipedia
    const url = `https://id.wikipedia.org/w/api.php`;
    const params = {
      action: 'query',
      generator: 'search', // Untuk menghasilkan hasil pencarian
      gsrsearch: query,
      gsrlimit: limit,
      prop: 'extracts|pageimages', // Mendapatkan deskripsi dan gambar
      exintro: true, // Hanya deskripsi singkat
      explaintext: true, // Menghapus format HTML dari deskripsi
      pilicense: 'any', // Hanya gambar dengan lisensi bebas
      format: 'json',
    };

    // Permintaan ke API Wikipedia
    const { data } = await axios.get(url, { params });

    if (data.query && data.query.pages) {
      const results = Object.values(data.query.pages).map((page) => ({
        title: page.title,
        description: page.extract || "Deskripsi tidak tersedia.",
        image: page.thumbnail?.source || "Gambar tidak tersedia.",
        pageUrl: `https://id.wikipedia.org/wiki/${encodeURIComponent(page.title)}`,
      }));

      // Mengirimkan hasil pencarian dengan informasi creator di atas
      return res.status(200).json({
        creator: "kaizel jskai",
        query: query,
        results: results,
      });
    } else {
      return res.status(404).json({
        error: "Hasil pencarian tidak ditemukan!",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Terjadi kesalahan dalam pencarian Wikipedia.",
    });
  }
};