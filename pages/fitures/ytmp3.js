const axios = require("axios");
const allowedApiKeys = require("../../declaration/arrayKey.jsx"); // Ganti dengan path ke file API key Anda

// Fungsi untuk mendapatkan link unduhan MP3
async function getYoutubeMp3(url) {
  try {
    const apiUrl = "https://fgsi-ytdl.hf.space/";
    const response = await axios.post(
      apiUrl,
      { url: url, type: "mp3" },
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
      return response.data.url; // Link unduhan file MP3
    } else {
      throw new Error("Failed to fetch download URL. Status code: " + response.status);
    }
  } catch (error) {
    throw new Error("Error fetching MP3 download URL: " + error.message);
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
    const downloadUrl = await getYoutubeMp3(url);

    // Redirect browser untuk langsung mengunduh file
    res.redirect(downloadUrl);
  } catch (error) {
    res.status(500).json({
      error: error.message || "An error occurred while processing the request.",
    });
  }
};
