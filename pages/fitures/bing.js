const axios = require('axios');
const cheerio = require('cheerio');
const allowedApiKeys = require("../../declaration/arrayKey.jsx"); // Import API keys

// Function to perform Bing search
async function searchBing(query) {
  try {
    const url = `https://www.bing.com/search?q=${encodeURIComponent(query)}`; // Encode query
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
      },
    });

    // Debug HTML to verify structure
    console.log('Response HTML:', data);

    const $ = cheerio.load(data); // Load HTML using Cheerio
    const results = [];

    $('.b_algo').each((index, element) => {
      const title = $(element).find('h2').text().trim();
      const link = $(element).find('a').attr('href')?.trim();
      const snippet = $(element).find('.b_caption p').text().trim();
      const image = $(element).find('.cico .rms_iac').attr('data-src')?.trim();

      results.push({
        title,
        link,
        snippet,
        image: image ? `https:${image}` : null,
      });
    });

    // Debug parsed results
    console.log('Parsed Results:', results);

    return results; // Return search results
  } catch (error) {
    console.error('Error fetching search results:', error.message);
    throw new Error('Error fetching search results: ' + error.message);
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
    const results = await searchBing(query);

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
