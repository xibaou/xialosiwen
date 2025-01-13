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
    const url = `https://www.goodreads.com/search?q=${encodeURIComponent(query)}`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const books = [];
    $('.tableList tr').each((index, element) => {
      const title = $(element).find('a.bookTitle span').text().trim();
      const link = $(element).find('a.bookTitle').attr('href');
      const rating = $(element).find('span.minirating').text().trim();

      books.push({ title, link: `https://www.goodreads.com${link}`, rating });
    });

    if (books.length === 0) {
      return res.status(404).json({
        creator: 'kaizel Kaijs',
        message: 'No matching results found',
      });
    }

    res.status(200).json({
      creator: 'kaizel Kaijs',
      results: books
    });
  } catch (error) {
    res.status(500).json({
      error: `Error: ${error.message}`,
    });
  }
};