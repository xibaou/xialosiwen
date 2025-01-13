const axios = require('axios');
const cheerio = require('cheerio');
const allowedApiKeys = require("../../declaration/arrayKey.jsx");

module.exports = async (req, res) => {
  const query = req.query.query || "";
  const apiKey = req.query.apiKey;

  if (!query) {
    return res.status(400).json({
      error: "Apa yang ingin Anda cari?",
    });
  }

  if (!apiKey || !allowedApiKeys.includes(apiKey)) {
    return res.status(403).json({
      error: "API key tidak valid atau tidak disediakan!",
    });
  }

  try {
    const url = `https://search.f-droid.org/?q=${encodeURIComponent(query)}&lang=id`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const apps = [];
    $('.package-header').each((index, element) => {
      const title = $(element).find('.package-name').text().trim();
      const apkUrl = $(element).attr('href');
      const LinkGambar = $(element).find('.package-icon').attr('src');

      apps.push({ title, apkUrl, LinkGambar });
    });

    if (apps.length === 0) {
      return res.status(404).json({
        creator: 'kaizel Kaijs',
        message: 'No matching results found',
      });
    }

    res.status(200).json({
      creator: 'kaizel Kaijs',
      results: apps
    });
  } catch (error) {
    res.status(500).json({
      error: `Error: ${error.message}`,
    });
  }
};