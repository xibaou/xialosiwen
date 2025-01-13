const axios = require("axios");
const allowedApiKeys = require("../../declaration/arrayKey.jsx");

// Daftar kurir
const kurirList = [
  { kurir: "jne", description: "JNE Express" },
  { kurir: "pos", description: "POS Indonesia" },
  { kurir: "jnt", description: "J&T Express" },
  { kurir: "jnt_cargo", description: "J&T Cargo" },
  { kurir: "sicepat", description: "SiCepat" },
  { kurir: "tiki", description: "TIKI" },
  { kurir: "anteraja", description: "AnterAja" },
  { kurir: "wahana", description: "Wahana" },
  { kurir: "ninja", description: "Ninja Express" },
  { kurir: "lion", description: "Lion Parcel" },
  { kurir: "pcp", description: "PCP Express" },
  { kurir: "jet", description: "JET Express" },
  { kurir: "rex", description: "REX Express" },
  { kurir: "first", description: "First Logistics" },
  { kurir: "ide", description: "ID Express" },
  { kurir: "spx", description: "Shopee Express" },
  { kurir: "kgx", description: "KGXpress" },
  { kurir: "sap", description: "SAP Express" },
  { kurir: "jxe", description: "JX Express" },
  { kurir: "rpx", description: "RPX" },
  { kurir: "kurir_tokopedia", description: "Kurir Rekomendasi" },
  { kurir: "lex", description: "Lazada Express" },
  { kurir: "indah_cargo", description: "Indah Cargo" },
  { kurir: "ant_cargo", description: "ANT Cargo" },
];

module.exports = async (req, res) => {
  const kurir = req.query.kurir || "";
  const resi = req.query.resi || "";
  const apiKey = req.query.apiKey;

  // Validasi input
  if (!kurir || !resi) {
    return res.status(400).json({
      error: "Kurir dan nomor resi harus disediakan!",
    });
  }

  // Validasi API Key
  if (!apiKey || !allowedApiKeys.includes(apiKey)) {
    return res.status(403).json({
      error: "API key tidak valid atau tidak disediakan!",
    });
  }

  // Validasi kurir
  const validKurir = kurirList.some((item) => item.kurir === kurir);
  if (!validKurir) {
    return res.status(400).json({
      error: "Kurir tidak valid! Silakan cek daftar kurir yang tersedia.",
      availableKurir: kurirList,
    });
  }

  try {
    // Request cek resi
    const { data } = await axios.post(
      "https://pluginongkoskirim.com/front/resi",
      {
        kurir,
        resi,
      },
      {
        headers: {
          accept: "*/*",
          "content-type": "application/json",
        },
      }
    );

    // Jika resi tidak ditemukan
    if (!data.result || !data.result.manifest) {
      return res.status(404).json({
        message: "Resi tidak ditemukan atau sedang diproses.",
        data,
      });
    }

    // Response sukses
    res.status(200).json({
      creator: "kaizel Kaijs",
      kurir,
      resi,
      results: data.result,
    });
  } catch (error) {
    // Error handling
    res.status(500).json({
      error: `Error: ${error.message}`,
    });
  }
};