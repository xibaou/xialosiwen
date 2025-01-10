const axios = require('axios');
const cheerio = require('cheerio');
const allowedApiKeys = require("../../declaration/arrayKey.jsx"); // Importing allowed API keys

// Function to fetch and scrape the page based on search query
async function scrapeNyaa(query) {
  try {
    // URL to scrape, with the query parameter dynamically added
    const url = `https://nhentai.net/search/?q=${encodeURIComponent(query)}`;
    
    // Fetching the page content
    const { data } = await axios.get(url);

    // Using cheerio to load the HTML
    const $ = cheerio.load(data);

    // Select each gallery item
    const galleries = [];

    $('.gallery').each((index, element) => {
      const title = $(element).find('.caption').text().trim();
      const link = $(element).find('a').attr('href');
      const imgSrc = $(element).find('img').attr('data-src');

      // Store gallery data
      galleries.push({
        title,
        link: `https://nhentai.net${link}`,
        imgSrc,
      });
    });

    return galleries;  // Return scraped data
  } catch (error) {
    throw new Error('Error scraping the page: ' + error.message);
  }
}

module.exports = async (req, res) => {
  const query = req.query.query || ''; // Query search term
  const apiKey = req.query.apiKey; // API key for authentication

  // Ensure query is provided
  if (!query) {
    return res.status(400).json({
      error: 'Search query is required!',
    });
  }

  // Ensure API key is valid
  if (!apiKey || !allowedApiKeys.includes(apiKey)) {
    return res.status(403).json({
      error: 'Invalid API key!',
    });
  }

  try {
    // Scraping the results from nhentai
    const results = await scrapeNyaa(query);

    if (results.length === 0) {
      return res.status(404).json({
        error: 'No results found!',
      });
    }

    // Returning the search results
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
