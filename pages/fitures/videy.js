const allowedApiKeys = require("../../declaration/arrayKey.jsx");

module.exports = async (req, res) => {
  const url = req.query.url || "";
  const apiKey = req.query.apiKey;

  if (!url) {
    return res.status(400).json({
      error: "URL tidak boleh kosong!",
    });
  }

  if (!apiKey || !allowedApiKeys.includes(apiKey)) {
    return res.status(403).json({
      error: "API key tidak valid atau tidak disediakan!",
    });
  }

  try {
    // Menghapus "v?id=" dari URL
    const UrlsLama = url.replace("v?id=", "");

    // Mengganti "https://" dengan "https://cdn."
    const NewUrl = UrlsLama.replace("https://", "https://cdn.");

    // URL baru dengan ekstensi .mp4
    const videoUrl = NewUrl + ".mp4";

    res.status(200).json({
      creator: "kaizel Kaijs",
      originalUrl: url,
      videoUrl: videoUrl,
    });
  } catch (error) {
    res.status(500).json({
      creator: "kaizel Kaijs",
      error: `Error processing the URL: ${error.message}`,
    });
  }
};