const axios = require("axios");
const allowedApiKeys = require("../../declaration/arrayKey.jsx"); // Ganti dengan path file API key Anda

// Fungsi untuk mendapatkan detail video YouTube
async function getYoutubeDetails(url) {
  try {
    const response = await axios.get(
      `https://web-production-32cf.up.railway.app/api/download/ytmp3?url=${encodeURIComponent(url)}&apikey=Zexxabot`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/537.36",
        },
        timeout: 10000, // Timeout 10 detik
      }
    );

    const data = response.data.result;

    return {
      title: data.title,
      duration: data.duration,
      thumbnail: data.thumb,
      quality: data.quality,
      size: data.size,
      audio: {
        url: data.url_dl,
        filesize: data.sizeB,
      },
    };
  } catch (error) {
    throw new Error("Error fetching YouTube details: " + error.message);
  }
}

// Fungsi utama (API endpoint handler)
module.exports = async (req, res) => {
  const url = req.query.url || "";
  const apiKey = req.query.apiKey;

  // Validasi input
  if (!url) {
    return res.status(400).json({
      error: "YouTube URL is required!",
    });
  }

  if (!apiKey || !allowedApiKeys.includes(apiKey)) {
    return res.status(403).json({
      error: "Invalid API key!",
    });
  }

  try {
    const result = await getYoutubeDetails(url);

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
