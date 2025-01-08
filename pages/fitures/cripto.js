const axios = require("axios");
const allowedApiKeys = require("../../declaration/arrayKey.jsx");

module.exports = async (req, res) => {
  const crypto = req.query.crypto || ""; // Nama cryptocurrency (contoh: bitcoin)
  const currency = req.query.currency || "usd"; // Mata uang (default: USD)
  const days = req.query.days || "30"; // Periode grafik harga (default: 30 hari)
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

  const cryptoPriceUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=${currency}`;
  const cryptoDetailUrl = `https://api.coingecko.com/api/v3/coins/${crypto}`;
  const cryptoChartUrl = `https://api.coingecko.com/api/v3/coins/${crypto}/market_chart?vs_currency=${currency}&days=${days}`;
  const trendingCoinsUrl = `https://api.coingecko.com/api/v3/search/trending`;

  try {
    // Fetch data harga
    const priceResponse = await axios.get(cryptoPriceUrl);
    const priceData = priceResponse.data;

    // Fetch data detail cryptocurrency
    const detailResponse = await axios.get(cryptoDetailUrl);
    const detailData = detailResponse.data;

    // Fetch data grafik harga sederhana
    const chartResponse = await axios.get(cryptoChartUrl);
    const chartData = chartResponse.data;

    // Harga awal, tertinggi, terendah, dan akhir dari grafik
    const prices = chartData.prices.map((item) => item[1]);
    const summaryChart = {
      start_price: prices[0] || "Tidak tersedia",
      highest_price: Math.max(...prices) || "Tidak tersedia",
      lowest_price: Math.min(...prices) || "Tidak tersedia",
      end_price: prices[prices.length - 1] || "Tidak tersedia",
    };

    // Fetch data trending coins
    const trendingResponse = await axios.get(trendingCoinsUrl);
    const trendingData = trendingResponse.data;

    if (!priceData[crypto]) {
      return res.status(404).json({
        error: "Cryptocurrency tidak ditemukan!",
      });
    }

    res.status(200).json({
      creator: "kaizel jskai",
      cryptocurrency: detailData.name, // Nama lengkap crypto
      symbol: detailData.symbol.toUpperCase(), // Simbol crypto
      description: detailData.description.en || "Tidak tersedia", // Deskripsi crypto
      market_rank: detailData.market_cap_rank || "Tidak tersedia", // Peringkat pasar
      current_price: `${priceData[crypto][currency]} ${currency.toUpperCase()}`,
      chart_summary: summaryChart, // Data grafik ringkas
      trending_coins: trendingData.coins.map((coin) => ({
        name: coin.item.name,
        symbol: coin.item.symbol,
        price_btc: coin.item.price_btc,
      })), // Koin yang sedang tren
    });
  } catch (error) {
    res.status(500).json({
      error: "Ada masalah, coba lagi nanti",
    });
  }
};
