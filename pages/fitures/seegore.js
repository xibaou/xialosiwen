const axios = require('axios');
const cheerio = require('cheerio');
const allowedApiKeys = require("../../declaration/arrayKey.jsx");

module.exports = async (req, res) => {
  const query = req.query.query || "";
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
    const slink = 'https://seegore.com/?s=' + query;
    const { data } = await axios.get(slink);
    const $ = cheerio.load(data);
    const link = [], judul = [], uploader = [], thumb = [], format = [];

    $('#post-items > li > article > div.content > header > h2 > a').each((a, b) => {
      link.push($(b).attr('href'));
      judul.push($(b).text());
    });

    $('#post-items > li > article > div.content > header > div > div.bb-cat-links > a').each((e, f) => {
      uploader.push($(f).text());
    });

    $('#post-items > li > article > div.post-thumbnail > a > div > img').each((g, h) => {
      thumb.push($(h).attr('src'));
    });

    for (let i = 0; i < link.length; i++) {
      format.push({
        judul: judul[i],
        uploader: uploader[i],
        thumb: thumb[i],
        link: link[i]
      });
    }

    if (format.length === 0) {
      return res.status(404).json({
        creator: 'kaizel Kaijs',
        message: 'No result found',
      });
    }

    res.status(200).json({
      creator: 'kaizel Kaijs',
      data: format
    });
  } catch (error) {
    res.status(500).json({
      error: "Ada masalah, coba lagi nanti",
    });
  }
};