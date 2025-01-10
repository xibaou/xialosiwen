const axios = require('axios');
const cheerio = require('cheerio');
const allowedApiKeys = require('../../declaration/arrayKey.jsx'); // Import API keys

// Function to fetch DuckDuckGo search results
async function searchDuckDuckGo(query) {
  try {
    const url = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`; // Encode query
    const { data } = await axios.get(url); // Fetch search results
    const $ = cheerio.load(data); // Load HTML using Cheerio

    const results = [];
    $('.result__body').each((index, element) => {
      const title = $(element).find('.result__a').text().trim(); // Extract title
      const link = $(element).find('.result__a').attr('href'); // Extract link

      results.push({
        title,
        link,
      });
    });

    return results; // Return search results
  } catch (error) {
    throw new Error('Error fetching DuckDuckGo results: ' + error.message);
  }
}

// API handler
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
    // Fetch DuckDuckGo search results
    const results = await searchDuckDuckGo(query);

    if (results.length === 0) {
      return res.status(404).json({
        error: 'No results found!',
      });
    }

    // Return the search results
    res.status(200).json({
      creator: 'kaizel jskai',
      query,
      results,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || 'An error occurred while searching.',
    });
  }
};
