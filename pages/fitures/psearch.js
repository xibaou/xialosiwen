/*
 * by kaizel jskai
 * don't delete my wm
 * follow more on Instagram: @iqstore78
 */

const axios = require("axios");
const cheerio = require("cheerio");
const allowedApiKeys = require("../../declaration/arrayKey.jsx"); // Tempatkan daftar API keys yang diperbolehkan

module.exports = async (req, res) => {
  const query = req.query.query || ""; // Query pencarian
  const apiKey = req.query.apiKey; // API Key untuk autentikasi

  // Memastikan query tidak kosong
  if (!query) {
    return res.status(400).json({
      error: "Query pencarian diperlukan!",
    });
  }

  // Memastikan API key valid
  if (!apiKey || !allowedApiKeys.includes(apiKey)) {
    return res.status(403).json({
      error: "Input Parameter Apikey!",
    });
  }

  // Fungsi untuk scraping hasil pencarian dari Pornhub
  async function scrapePornhub(query) {
    try {
      const url = `https://www.pornhub.com/video/search?search=${encodeURIComponent(query)}`;
      const { data } = await axios.get(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      });

      const $ = cheerio.load(data);
      const results = [];

      $(".pcVideoListItem").each((i, el) => {
        const title = $(el).find(".title a").text().trim();
        const url = `https://www.pornhub.com${$(el).find(".title a").attr("href")}`;
        const duration = $(el).find(".duration").text().trim();
        const thumbnail = $(el).find("img").attr("data-src") || $(el).find("img").attr("src");

        if (title && url) {
          results.push({
            title,
            url,
            duration,
            thumbnail,
          });
        }
      });

      return results;
    } catch (error) {
      throw new Error("Gagal melakukan scraping.");
    }
  }

  try {
    // Mendapatkan hasil pencarian
    const results = await scrapePornhub(query);

    if (results.length === 0) {
      return res.status(404).json({
        error: "Hasil pencarian tidak ditemukan!",
      });
    }

    // Menyusun hasil pencarian
    res.status(200).json({
      creator: "kaizel jskai",
      query: query,
      results: results,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || "Terjadi kesalahan dalam pencarian konten.",
    });
  }
};