const axios = require("axios");
const ytdl = require("@balxz/this-ytdl");
const allowedApiKeys = require("../../declaration/arrayKey.jsx");

async function getYoutubeMP3(url) {
  try {
    const mp3 = await ytdl.ytmp3(url);
    return {
      status: true,
      mp3Link: mp3,
    };
  } catch (error) {
    throw new Error("Error generating MP3 link: " + error.message);
  }
}

module.exports = async (req, res) => {
  const url = req.query.url || '';
  const apiKey = req.query.apiKey;

  if (!url) {
    return res.status(400).json({
      error: 'YouTube URL is required!',
    });
  }

  if (!apiKey || !allowedApiKeys.includes(apiKey)) {
    return res.status(403).json({
      error: 'Invalid API key!',
    });
  }

  try {
    const result = await getYoutubeMP3(url);
    
    if (result.status) {
      res.status(200).json({
        creator: 'kaizel jskai',
        url: url,
        mp3Link: result.mp3Link,
      });
    } else {
      res.status(500).json({
        error: 'Failed to fetch MP3 link.',
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message || 'An error occurred while processing the request.',
    });
  }
};
