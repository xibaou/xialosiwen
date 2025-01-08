/*
 * by kaizel jskai
 * don't delete my wm
 * follow more on Instagram: @iqstore78
 */

const axios = require("axios");
const cheerio = require("cheerio");
const allowedApiKeys = require("../../declaration/arrayKey.jsx");

module.exports = async (req, res) => {
  const query = req.query.query; // Kata kunci pencarian
  const apiKey = req.query.apiKey; // API Key untuk validasi

  // Validasi input
  if (!query) {
    return res.status(400).json({
      error: "Query pencarian tidak ditemukan!",
    });
  }

  if (!apiKey || !allowedApiKeys.includes(apiKey)) {
    return res.status(403).json({
      error: "API Key tidak valid atau tidak diberikan!",
    });
  }

  // URL pencarian Play Store
  const url = `https://play.google.com/store/search?q=${encodeURIComponent(query)}&c=apps`;

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const results = [];

    // Parsing hasil pencarian
    $(".ULeU3b > .VfPpkd-WsjYwc").each((_, element) => {
      const linkk = $(element).find("a").attr("href");
      const nama = $(element).find(".DdYX5").text();
      const developer = $(element).find(".wMUdtb").text();
      const img = $(element).find("img").attr("src");
      const rate = $(element).find(".ubGTjb > div").attr("aria-label");
      const rate2 = $(element).find(".w2kbF").text();
      const downloads = $(element).find(".IxB2fe").text(); // Ekstrak jumlah unduhan
      const description = $(element).find(".b8cIId.ReQCgd.Q9MA7b").text(); // Deskripsi
      const link = `https://play.google.com${linkk}`;

      results.push({
        link: link,
        nama: nama || "No Name",
        developer: developer || "No Developer",
        img: img || "https://i.ibb.co/G7CrCwN/404.png",
        rate: rate || "No Rate",
        rate2: rate2 || "No Rate",
        downloads: downloads || "No Downloads", // Menambahkan jumlah unduhan
        description: description || "No Description", // Menambahkan deskripsi aplikasi
        link_dev: `https://play.google.com/store/apps/developer?id=${developer
          .split(" ")
          .join("+")}`,
      });
    });

    // Validasi hasil pencarian
    if (results.length === 0) {
      return res.status(404).json({
        error: "Aplikasi tidak ditemukan untuk pencarian ini.",
      });
    }

    // Respons berhasil
    res.status(200).json({
      creator: "kaizel jskai",
      query,
      total_results: results.length,
      apps: results,
    });
  } catch (error) {
    // Penanganan error
    console.error(error);
    res.status(500).json({
      error: "Ada masalah, coba lagi nanti.",
    });
  }
};
