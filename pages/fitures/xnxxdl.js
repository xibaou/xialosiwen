const axios = require('axios');
const allowedApiKeys = require("../../declaration/arrayKey.jsx"); // Replace with path to your API keys file

// Fetch Video Data
async function fetchVideoData(url) {
  const fullUrl = `https://web-production-32cf.up.railway.app/api/download/xnxxdl?url=${encodeURIComponent(url)}&apikey=Zexxabot`;

  try {
    const response = await axios.get(fullUrl, { timeout: 10000 }); // Timeout 10 seconds

    if (response.status === 200) {
      const { author, ...dataWithoutAuthor } = response.data; // Remove author if exists
      return dataWithoutAuthor;
    } else {
      throw new Error(`Failed to fetch data. Status code: ${response.status}`);
    }
  } catch (error) {
    throw new Error(`Error occurred while fetching data: ${error.message}`);
  }
}

// API Handler
module.exports = async (req, res) => {
  const url = req.query.url || "";
  const apiKey = req.query.apiKey;

  // Validate Input
  if (!url) {
    return res.status(400).json({
      error: "Video URL is required!",
    });
  }

  if (!apiKey || !allowedApiKeys.includes(apiKey)) {
    return res.status(403).json({
      error: "Invalid API key!",
    });
  }

  try {
    const result = await fetchVideoData(url);

    res.status(200).json({
      creator: "kaizel jskai",
      url: url,
      details: result,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || "An error occurred while processing the request.",
    });
  }
};