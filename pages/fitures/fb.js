/*
 * by kaizel jskai
 * don't delete my wm
 * follow more on Instagram: @iqstore78
 */
const axios = require("axios");
const allowedApiKeys = require("../../declaration/arrayKey.jsx");

module.exports = async (req, res) => {
  const urls = req.query.urls;
  const apiKey = req.query.apiKey;

  if (!urls) {
    return res.status(400).json({
      error: "Url Ig Nya Mana?"
    });
  }

  if (!apiKey || !allowedApiKeys.includes(apiKey)) {
    return res.status(403).json({
      error: "Input Parameter Apikey!"
    });
  }

  const url = `https://vkrdownloader.vercel.app/server?vkr=${urls}`;

  try {
    const response = await axios.get(url);
    const { data } = response.data;

    if (!data || !data.downloads || data.downloads.length === 0) {
      return res.status(404).json({
        error: "Tidak ada data video yang ditemukan."
      });
    }

    const downloads = data.downloads.map((download) => ({
      url: download.url,
      format_id: download.format_id,
      size: download.size,
    }));

    res.status(200).json({
      creator: "kaizel jskai", // Properti creator berada di paling atas
      title: data.title || null,
      source: data.source || "instagram",
      description: data.description || null,
      downloads,
    });
  } catch (error) {
    res.status(500).json({
      error: "Ada masalah, coba lagi nanti",
    });
  }
};
