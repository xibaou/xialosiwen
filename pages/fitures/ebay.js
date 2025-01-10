const axios = require('axios');
const cheerio = require('cheerio');
const allowedApiKeys = require("../../declaration/arrayKey.jsx"); // Import API keys

// Function to scrape eBay search results
async function searchEbay(query) {
  try {
    const url = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}`; // Encode query
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    const $ = cheerio.load(data); // Load HTML using Cheerio
    const results = [];

    // Scrape product information from eBay search results
    $('.s-item').each((index, element) => {
      const title = $(element).find('.s-item__title').text().trim();
      const link = $(element).find('.s-item__link').attr('href')?.trim();
      const price = $(element).find('.s-item__price').text().trim();

      if (title && link) {
        results.push({
          title,
          link,
          price,
        });
      }
    });

    return results; // Return search results
  } catch (error) {
    throw new Error('Error fetching eBay results: ' + error.message);
  }
}

module.exports = async (req, res) => {
  const query = req.query.query || ''; // Get query from request
  const apiKey = req.query.apiKey; // Get API key

  // Ensure query is provided
  if (!query) {
    return res.status(400).json({
      error: 'Search query is required!',
    });
  }

  // Validate API key
  if (!apiKey || !allowedApiKeys.includes(apiKey)) {
    return res.status(403).json({
      error: 'Invalid API key!',
    });
  }

  try {
    // Fetch search results
    const results = await searchEbay(query);

    if (results.length === 0) {
      return res.status(404).json({
        error: 'No results found!',
      });
    }

    // Return the search results
    res.status(200).json({
      creator: 'kaizel jskai',
      query: query,
      results: results,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || 'An error occurred while searching.',
    });
  }
};
