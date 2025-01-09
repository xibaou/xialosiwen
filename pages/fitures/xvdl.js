/*
 * by kaizel jskai
 * don't delete my wm
 * follow more on Instagram: @iqstore78
 */

const { xvideosdl } = require("api-dylux"); // Import fungsi xvideosdl dari api-dylux
const allowedApiKeys = require("../../declaration/arrayKey.jsx"); // Tempatkan daftar API keys yang diperbolehkan

module.exports = async (req, res) => {
  const url = req.query.url || ""; // URL video dari xvideos
  const apiKey = req.query.apiKey; // API Key untuk autentikasi

  // Memastikan URL tidak kosong
  if (!url) {
    return res.status(400).json({
      error: "URL video diperlukan!",
    });
  }

  // Memastikan API key valid
  if (!apiKey || !allowedApiKeys.includes(apiKey)) {
    return res.status(403).json({
      error: "Input Parameter Apikey!",
    });
  }

  try {
    // Mendownload video menggunakan xvideosdl
    const video = await xvideosdl(url);

    if (!video) {
      return res.status(404).json({
        error: "Video tidak ditemukan!",
      });
    }

    // Menyusun respons JSON
    return res.status(200).json({
      creator: "kaizel jskai",
      title: video.title,
      duration: video.duration,
      download: video.files,
      thumb: video.thumb,
    });
  } catch (error) {
    res.status(500).json({
      error: "Terjadi kesalahan dalam proses download video xvideos.",
    });
  }
};