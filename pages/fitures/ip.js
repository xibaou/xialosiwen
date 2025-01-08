const axios = require("axios");
const allowedApiKeys = require("../../declaration/arrayKey.jsx");

module.exports = async (req, res) => {
  const ip = req.query.ip || ""; // Parameter IP
  const apiKey = req.query.apiKey;

  if (!ip) {
    return res.status(400).json({
      error: "Harap masukkan alamat IP!",
    });
  }

  if (!apiKey || !allowedApiKeys.includes(apiKey)) {
    return res.status(403).json({
      error: "API Key tidak valid atau tidak disertakan!",
    });
  }

  const ipLookupUrl = `https://ipapi.co/${ip}/json/`; // API untuk IP lookup

  try {
    const response = await axios.get(ipLookupUrl);

    if (response.status !== 200) {
      return res.status(response.status).json({
        error: "Gagal mendapatkan data dari layanan IP lookup.",
      });
    }

    const data = response.data;

    res.status(200).json({
      creator: "kaizel jskai", // Metadata creator
      alamat_ip: data.ip || "Tidak tersedia",
      kota: data.city || "Tidak tersedia",
      wilayah: data.region || "Tidak tersedia",
      negara: data.country_name || "Tidak tersedia",
      kode_negara: data.country_code || "Tidak tersedia",
      zona_waktu: data.timezone || "Tidak tersedia",
      latitude: data.latitude || "Tidak tersedia",
      longitude: data.longitude || "Tidak tersedia",
      penyedia_layanan_internet: data.org || "Tidak tersedia",
    });
  } catch (error) {
    if (error.response) {
      // Error dari API eksternal
      res.status(error.response.status).json({
        error: `Layanan IP lookup bermasalah: ${error.response.statusText}`,
      });
    } else if (error.request) {
      // Error jaringan
      res.status(503).json({
        error: "Tidak dapat terhubung ke layanan IP lookup. Coba lagi nanti.",
      });
    } else {
      // Error lainnya
      res.status(500).json({
        error: "Terjadi kesalahan internal pada server.",
      });
    }
  }
};
