const axios = require('axios');
const cheerio = require('cheerio');
const allowedApiKeys = require("../../declaration/arrayKey.jsx");

module.exports = async (req, res) => {
  const query = req.query.query || "";
  const apiKey = req.query.apiKey;

  // Validasi input query
  if (!query) {
    return res.status(400).json({
      error: "Apa yang ingin Anda cari?",
    });
  }

  // Validasi API Key
  if (!apiKey || !allowedApiKeys.includes(apiKey)) {
    return res.status(403).json({
      error: "API key tidak valid atau tidak disediakan!",
    });
  }

  try {
    const url = `https://m.gsmarena.com/results.php3?sQuickSearch=yes&sName=${encodeURIComponent(query)}`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const devices = [];
    $('.general-menu ul li').each((_, element) => {
      const anchor = $(element).find('a');
      const image = anchor.find('img').attr('src');
      const name = anchor.find('strong').html().replace(/<br\s*\/?>/g, ' ').trim();

      devices.push({
        name,
        url: `https://m.gsmarena.com/${anchor.attr('href')}`,
        image
      });
    });

    // Jika tidak ada hasil
    if (devices.length === 0) {
      return res.status(404).json({
        creator: "kaizel Kaijs",
        message: "No matching results found",
      });
    }

    // Response sukses
    res.status(200).json({
      creator: "kaizel Kaijs",
      results: devices
    });
  } catch (error) {
    // Error handling
    res.status(500).json({
      error: `Error: ${error.message}`,
    });
  }
};