const axios = require('axios');
const cheerio = require('cheerio');
const allowedApiKeys = require("../../declaration/arrayKey.jsx"); // Import API keys

// Function to scrape image description
async function scrapeImageDescription(url, prompt = "") {
  try {
    const { data: response } = await axios.post(
      "https://pallyy.com/api/tools/image-to-description/get",
      {
        imageUrl: url,
        prompt: prompt,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Referer: "https://imagedescriber.online/",
          Origin: "https://imagedescriber.online",
          "User-Agent": "Postify/1.0.0",
          "X-Forwarded-For": Array(4)
            .fill(0)
            .map(() => Math.floor(Math.random() * 256))
            .join("."),
        },
      }
    );
    return response; // Return the description if successful
  } catch (error) {
    throw new Error('Error fetching image description: ' + error.message);
  }
}

module.exports = async (req, res) => {
  const url = req.query.url || ''; // Get image URL from request
  const prompt = req.query.prompt || ''; // Get prompt from request
  const apiKey = req.query.apiKey; // Get API key

  // Ensure URL is provided
  if (!url) {
    return res.status(400).json({
      error: 'Image URL is required!',
    });
  }

  // Validate API key
  if (!apiKey || !allowedApiKeys.includes(apiKey)) {
    return res.status(403).json({
      error: 'Invalid API key!',
    });
  }

  try {
    // Fetch image description
    const description = await scrapeImageDescription(url, prompt);

    if (!description) {
      return res.status(404).json({
        error: 'No description found!',
      });
    }

    // Return the image description
    res.status(200).json({
      creator: 'kaizel jskai',
      url: url,
      description: description,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || 'An error occurred while processing the image.',
    });
  }
};
