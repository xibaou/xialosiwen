const axios = require('axios');
const cheerio = require('cheerio');
const allowedApiKeys = require("../../declaration/arrayKey.jsx");

module.exports = async (req, res) => {
  const query = req.query.query; // Query pencarian Google
  const apiKey = req.query.apiKey; // API Key untuk validasi

  // Validasi input
  if (!query) {
    return res.status(400).json({
      error: "Query pencarian Google tidak ditemukan!",
    });
  }

  if (!apiKey || !allowedApiKeys.includes(apiKey)) {
    return res.status(403).json({
      error: "API Key tidak valid atau tidak diberikan!",
    });
  }

  // URL Google Search
  const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

  try {
    // Mengirim permintaan GET ke Google dengan headers User-Agent untuk menyamarkan permintaan
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    // Parsing HTML menggunakan cheerio
    const $ = cheerio.load(response.data);

    const results = [];

    // Mengambil hasil pencarian dari elemen yang relevan
    $('.tF2Cxc').each((index, element) => {
      const title = $(element).find('.DKV0Md').text();
      const link = $(element).find('a').attr('href');
      const snippet = $(element).find('.VwiC3b').text();

      // Menambahkan hasil pencarian ke array
      results.push({
        title,
        link,
        snippet,
      });
    });

    // Jika tidak ada hasil ditemukan
    if (results.length === 0) {
      return res.status(404).json({
        error: "Tidak ditemukan hasil untuk pencarian ini.",
      });
    }

    // Mengembalikan hasil pencarian
    res.status(200).json({
      query,
      total_results: results.length,
      results,
    });
  } catch (error) {
    // Penanganan error
    console.error('Error scraping Google search:', error);
    res.status(500).json({
      error: "Ada masalah, coba lagi nanti.",
    });
  }
};
