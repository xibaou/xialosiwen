const axios = require('axios');
const cheerio = require('cheerio');
const allowedApiKeys = require('../../declaration/arrayKey.jsx'); // Import API keys

// Function to fetch chord details
async function searchChord(query) {
  try {
    const searchUrl = `https://www.gitagram.com/?s=${encodeURIComponent(query).replace(/%20/g, '+')}`;
    const { data: searchData } = await axios.get(searchUrl); // Fetch search results
    const $ = cheerio.load(searchData);

    const $url = $('table.table > tbody > tr')
      .eq(0)
      .find('td')
      .eq(0)
      .find('a')
      .eq(0);
    const url = $url.attr('href');

    if (!url) {
      throw new Error('No results found!');
    }

    const { data: songData } = await axios.get(url); // Fetch song details
    const $song = cheerio.load(songData);

    const $hcontent = $song('div.hcontent');
    const artist = $hcontent.find('div > a > span.subtitle').text().trim();
    const artistUrl = $hcontent.find('div > a').attr('href');
    const title = $hcontent.find('h1.title').text().trim();
    const chord = $song('div.content > pre').text().trim();

    return {
      url,
      artist,
      artistUrl,
      title,
      chord,
    };
  } catch (error) {
    throw new Error('Error fetching chord details: ' + error.message);
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
    // Fetch chord details
    const result = await searchChord(query);

    // Return the chord details
    res.status(200).json({
      creator: 'kaizel jskai',
      query,
      result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || 'An error occurred while fetching the chord.',
    });
  }
};
