const axios = require("axios");
const allowedApiKeys = require("../../declaration/arrayKey.jsx"); // Ganti dengan path file API key Anda

// Fungsi untuk mendapatkan detail MP3 YouTube
async function getYoutubeMp3(url) {
  try {
    const apiUrl = "https://fgsi-ytdl.hf.space/";
    const response = await axios.post(
      apiUrl,
      { url: url, type: "mp3" }, // Kirim data URL dan tipe
      {
        headers: {
          "Content-Type": "application/json",
          "User-Agent":
            "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/537.36",
        },
        timeout: 10000, // Timeout 10 detik
      }
    );

    if (response.status === 200) {
      const data = response.data;
      return {
        title: data.title,
        duration: data.duration,
        thumbnail: data.thumbnail,
        audio: {
          url: data.url,
          size: data.size,
        },
      };
    } else {
      throw new Error("Failed to fetch data. Status code: " + response.status);
    }
  } catch (error) {
    throw new Error("Error fetching YouTube MP3 details: " + error.message);
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
    const result = await getYoutubeMp3(url);

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
