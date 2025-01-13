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
    const url = `https://wp.hellosehat.com/?s=${encodeURIComponent(query)}`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const articles = $(".card.article--card").map((index, element) => {
      const article = $(element);
      return {
        title: article.find("h2.entry-title a").text().trim(),
        link: article.find("h2.entry-title a").attr("href"),
        desc: article.find(".entry-summary p").text().trim(),
        author: article.find(".author.vcard a").text().trim(),
        time: article.find("time.entry-date.published").attr("datetime")
      };
    }).get().filter(article => article.title && article.desc);

    if (articles.length === 0) {
      return res.status(404).json({
        creator: 'kaizel Kaijs',
        message: 'No matching results found',
      });
    }

    const totalResults = parseInt($(".search--result-count").text(), 10) || 0;

    res.status(200).json({
      creator: 'kaizel Kaijs',
      total: totalResults,
      results: articles
    });
  } catch (error) {
    res.status(500).json({
      error: `Error: ${error.message}`,
    });
  }
};