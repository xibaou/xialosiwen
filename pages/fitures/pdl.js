/*
 * by kaizel jskai
 * don't delete my wm
 * follow more on Instagram: @iqstore78
 */

const axios = require("axios");
const cheerio = require("cheerio");
const allowedApiKeys = require("../../declaration/arrayKey.jsx"); // Tempatkan daftar API keys yang diperbolehkan

module.exports = async (req, res) => {
  const url = req.query.url || ""; // URL video Pornhub
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

  // Fungsi untuk scraping link download dari Pornhub
  async function scrapeDownloadLink(url) {
    try {
      const { data } = await axios.get(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      });

      const $ = cheerio.load(data);
      const videoSources = [];

      // Menyaring URL unduhan dari tag <source>
      $("video source").each((i, el) => {
        const quality = $(el).attr("label");
        const link = $(el).attr("src");

        if (link) {
          videoSources.push({
            quality: quality || "Unknown",
            url: link,
          });
        }
      });

      return videoSources;
    } catch (error) {
      throw new Error("Gagal mengambil link unduhan.");
    }
  }

  try {
    // Mendapatkan link unduhan
    const downloadLinks = await scrapeDownloadLink(url);

    if (downloadLinks.length === 0) {
      return res.status(404).json({
        error: "Link unduhan tidak ditemukan!",
      });
    }

    // Menyusun hasil unduhan
    res.status(200).json({
      creator: "kaizel jskai",
      videoUrl: url,
      downloadLinks: downloadLinks,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || "Terjadi kesalahan dalam mengambil data unduhan.",
    });
  }
};