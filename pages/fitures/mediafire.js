const cheerio = require("cheerio");
const { fetch } = require("undici");
const { lookup } = require("mime-types");
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
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    // Validasi elemen sebelum digunakan
    const filename = $(".dl-btn-label").attr("title") || "Unknown";
    const sizeMatch = $(".download_link .input").text().trim().match(/(.*?)/);
    const size = sizeMatch ? sizeMatch[1] : "Unknown";
    const ext = filename.split(".").pop();
    const mimetype = lookup(ext.toLowerCase()) || "application/" + ext.toLowerCase();
    const download = $(".input").attr("href") || "";

    // Periksa data yang wajib ada
    if (!filename || !download) {
      return res.status(400).json({
        error: "Gagal mengambil data dari URL MediaFire!",
      });
    }

    res.status(200).json({
      creator: "kaizel Kaijs",
      originalUrl: url,
      filename,
      size,
      ext,
      mimetype,
      download,
    });
  } catch (error) {
    console.error("Error processing URL:", error.message);
    res.status(500).json({
      creator: "kaizel Kaijs",
      error: `Error processing the URL: ${error.message}`,
    });
  }
};
