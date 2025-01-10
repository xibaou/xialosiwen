const ytdl = require("@balxz/this-ytdl");
const allowedApiKeys = require("../../declaration/arrayKey.jsx");

async function getYoutubeTranscript(url) {
  try {
    const transcript = await ytdl.transcript(url);
    return {
      status: true,
      transcript: transcript,
    };
  } catch (error) {
    throw new Error("Error fetching transcript: " + error.message);
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
    const result = await getYoutubeTranscript(url);

    if (result.status) {
      res.status(200).json({
        creator: 'kaizel jskai',
        url: url,
        transcript: result.transcript,
      });
    } else {
      res.status(500).json({
        error: 'Failed to fetch transcript.',
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message || 'An error occurred while processing the request.',
    });
  }
};
