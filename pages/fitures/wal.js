/*
 * by kaizel jskai
 * don't delete my wm
 * follow more on Instagram: @iqstore78
 */

const axios = require('axios');
const cheerio = require('cheerio');
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

  // Fungsi untuk scraping gambar dari wallpaperflare
  function chara(query) {
    return new Promise((resolve, reject) => {
      axios.get('https://www.wallpaperflare.com/search?wallpaper=' + query, {
        headers: {
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          "cookie": "_ga=GA1.2.863074474.1624987429; _gid=GA1.2.857771494.1624987429; __gads=ID=84d12a6ae82d0a63-2242b0820eca0058:T=1624987427:RT=1624987427:S=ALNI_MaJYaH0-_xRbokdDkQ0B49vSYgYcQ"
        }
      })
      .then(({ data }) => {
        const $ = cheerio.load(data);
        const result = [];
        $('#gallery > li > figure > a').each(function(a, b) {
          result.push($(b).find('img').attr('data-src'));
        });
        resolve(result);
      })
      .catch(() => {
        reject({ status: 'err' });
      });
    });
  }

  try {
    // Mendapatkan hasil gambar dengan fungsi chara
    const images = await chara(query);

    if (images.length === 0) {
      return res.status(404).json({
        error: "Hasil pencarian tidak ditemukan!",
      });
    }

    // Menyusun hasil pencarian dengan informasi creator
    const results = images.map(image => ({
      image: image,
    }));

    // Mengirimkan hasil pencarian dengan informasi creator di atas
    res.status(200).json({
      creator: "by kaizel jskai",
      query: query,
      results: results,
    });
  } catch (error) {
    res.status(500).json({
      error: "Terjadi kesalahan dalam pencarian gambar.",
    });
  }
};
