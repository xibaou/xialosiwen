/*
 * by kaizel jskai
 * don't delete my wm
 * follow more on Instagram: @iqstore78
 */
const axios = require("axios");
const allowedApiKeys = require("../../declaration/arrayKey.jsx");

module.exports = async (req, res) => {
  const crypto = req.query.crypto || ""; // Nama cryptocurrency (misal: bitcoin, ethereum)
  const currency = req.query.currency || "usd"; // Mata uang untuk konversi (default: USD)
  const apiKey = req.query.apiKey;

  if (!crypto) {
    return res.status(400).json({
      error: "Nama cryptocurrency apa?",
    });
  }

  if (!apiKey || !allowedApiKeys.includes(apiKey)) {
    return res.status(403).json({
      error: "Input Parameter Apikey!",
    });
  }

  const cryptoUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=${currency}`;
  const cryptoDetailUrl = `https://api.coingecko.com/api/v3/coins/${crypto}`; // Untuk mendapatkan keterangan crypto

  try {
    // Fetch data harga
    const priceResponse = await axios.get(cryptoUrl);
    const priceData = priceResponse.data;

    // Fetch data detail cryptocurrency
    const detailResponse = await axios.get(cryptoDetailUrl);
    const detailData = detailResponse.data;

    if (!priceData[crypto]) {
      return res.status(404).json({
        error: "Cryptocurrency tidak ditemukan!",
      });
    }

    res.status(200).json({
      "creator": "kaizel jskai", // Menambahkan nama kreator
      "cryptocurrency": detailData.name, // Nama lengkap crypto
      "symbol": detailData.symbol.toUpperCase(), // Simbol crypto (contoh: BTC)
      "keterangan": detailData.description.en || "Tidak tersedia", // Deskripsi crypto
      "mata_uang": currency.toUpperCase(),
      "harga": `${priceData[crypto][currency]} ${currency.toUpperCase()}`,
      "peringkat": detailData.market_cap_rank || "Tidak tersedia", // Peringkat pasar crypto
    });
  } catch (error) {
    res.status(500).json({
      error: "Ada masalah, coba lagi nanti",
    });
  }
};
