const axios = require("axios");
const cheerio = require("cheerio");
const allowedApiKeys = require("../../declaration/arrayKey.jsx");

async function scrapeSoundCloud(query) {
  try {
    const url = `https://m.soundcloud.com/search?q=${encodeURIComponent(query)}`;
    const { data } = await axios.get(url);

    const $ = cheerio.load(data);
    
    let results = [];

    $('.List_VerticalList__2uQYU li').each((index, element) => {
      const title = $(element).find('.Cell_CellLink__3yLVS').attr('aria-label');
      const musicUrl = 'https://m.soundcloud.com' + $(element).find('.Cell_CellLink__3yLVS').attr('href');

      if (title && musicUrl) {
        results.push({ title, url: musicUrl });
      }
    });

    return results.slice(0, 5); // Ambil hanya yang teratas
  } catch (error) {
    throw new Error("Error scraping SoundCloud data: " + error.message);
  }
}

module.exports = async (req, res) => {
  const query = req.query.query || '';
  const apiKey = req.query.apiKey;

  if (!query) {
    return res.status(400).json({
      error: 'Search query is required!',
    });
  }

  if (!apiKey || !allowedApiKeys.includes(apiKey)) {
    return res.status(403).json({
      error: 'Invalid API key!',
    });
  }

  try {
    const results = await scrapeSoundCloud(query);

    if (results.length > 0) {
      res.status(200).json({
        creator: 'kaizel jskai',
        query: query,
        results: results,
      });
    } else {
      res.status(404).json({
        error: 'No results found.',
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message || 'An error occurred while processing the request.',
    });
  }
};
