const axios = require('axios');
const cheerio = require('cheerio');
const allowedApiKeys = require("../../declaration/arrayKey.jsx");

module.exports = async (req, res) => {
  const query = req.query.query || ""; // Parameter untuk kata kunci pencarian
  const apiKey = req.query.apiKey;

  if (!query) {
    return res.status(400).json({
      error: "Apa yang ingin Anda cari?",
    });
  }

  if (!apiKey || !allowedApiKeys.includes(apiKey)) {
    return res.status(403).json({
      error: "API key tidak valid atau tidak disediakan!",
    });
  }

  try {
    const { data, status } = await axios.get('https://store.steampowered.com/search/?term=' + query);
    const $ = cheerio.load(data);
    const hasil = [];

    $('#search_resultsRows > a').each((a, b) => {
      const link = $(b).attr('href');
      const judul = $(b).find(`div.responsive_search_name_combined > div.col.search_name.ellipsis > span`).text();
      const harga = $(b).find(`div.responsive_search_name_combined > div.col.search_price_discount_combined.responsive_secondrow > div.col.search_price.responsive_secondrow `).text().replace(/ /g, '').replace(/\n/g, '');
      let rating = $(b).find(`div.responsive_search_name_combined > div.col.search_reviewscore.responsive_secondrow > span`).attr('data-tooltip-html');
      const img = $(b).find(`div.col.search_capsule > img`).attr('src');
      const rilis = $(b).find(`div.responsive_search_name_combined > div.col.search_released.responsive_secondrow`).text();

      if (typeof rating === 'undefined') {
        rating = 'no ratings';
      }
      if (rating.split('<br>')) {
        let hhh = rating.split('<br>');
        rating = `${hhh[0]} ${hhh[1]}`;
      }

      hasil.push({
        judul: judul,
        img: img,
        link: link,
        rilis: rilis,
        harga: harga ? harga : 'no price',
        rating: rating
      });
    });

    if (hasil.length === 0) {
      return res.status(404).json({
        creator: 'kaizel Kaijs',
        message: 'No result found',
      });
    }

    res.status(200).json({
      creator: 'kaizel Kaijs',
      results: hasil
    });
  } catch (error) {
    res.status(500).json({
      error: "Ada masalah, coba lagi nanti",
    });
  }
};