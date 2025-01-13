const axios = require("axios");
const allowedApiKeys = require("../../declaration/arrayKey.jsx");

module.exports = async (req, res) => {
  const url = req.query.url || "";
  const apiKey = req.query.apiKey;

  // Validasi URL dan API key
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
    // Ekstraksi `surl` dari URL Terabox
    const parsedUrl = new URL(url);
    const pathSegments = parsedUrl.pathname.split("/");
    const surl =
      pathSegments[1] === "s" ? pathSegments[2] : parsedUrl.searchParams.get("surl");

    if (!surl) {
      return res.status(400).json({
        error: "URL Terabox tidak valid!",
      });
    }

    // Fetch metadata dari API Terabox
    const metadataResponse = await axios.get(
      `https://terabox.hnn.workers.dev/api/get-info?shorturl=${surl}&pwd=`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0",
          "accept-language": "id-ID",
          referer: "https://terabox.hnn.workers.dev/",
        },
      }
    );

    const metadata = metadataResponse.data;

    if (!metadata || !metadata.list || metadata.list.length === 0) {
      return res.status(404).json({
        error: "Tidak ada file yang ditemukan pada URL Terabox ini!",
      });
    }

    // Mengambil link unduhan untuk setiap file
    const downloadLinks = await Promise.all(
      metadata.list.map(async (file) => {
        const downloadResponse = await axios.post(
          "https://terabox.hnn.workers.dev/api/get-download",
          {
            shareid: metadata.shareid,
            uk: metadata.uk,
            sign: metadata.sign,
            timestamp: metadata.timestamp,
            fs_id: file.fs_id,
          },
          {
            headers: {
              "User-Agent": "Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0",
              "Content-Type": "application/json",
              "accept-language": "id-ID",
              referer: "https://terabox.hnn.workers.dev/",
            },
          }
        );

        return {
          filename: file.server_filename,
          size: file.size,
          downloadUrl: downloadResponse.data.downloadLink,
        };
      })
    );

    res.status(200).json({
      creator: "kaizel Kaijs",
      originalUrl: url,
      files: downloadLinks,
    });
  } catch (error) {
    res.status(500).json({
      creator: "kaizel Kaijs",
      error: `Terjadi kesalahan saat memproses URL Terabox: ${error.message}`,
    });
  }
};