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
    const url = 'https://itch.io/search?q=' + encodeURIComponent(query);
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const games = [];
    const ling = [];
    const aut = [];
    const judul = [];

    $('div.game_title > a').each(function (a, b) {
      ling.push($(b).attr('href'));
      judul.push($(b).text().trim());
    });

    $('div.game_author > a').each(function (a, b) {
      aut.push($(b).attr('href'));
    });

    const gen = $('div.game_genre');
    const plat = $('span.web_flag');
    const desk = $('div.game_text');
    const rate = $('span.screenreader_only');

    for (let i = 0; i < 10; i++) {
      const Title = judul[i];
      const Link = ling[i];
      const Author = aut[i];
      const Genre = $(gen[i]).text().trim();
      const Platform = $(plat[i]).text().trim();
      const Deskripsi = $(desk[i]).text().trim();
      const Rating = $(rate[i]).text().trim();
      games.push({
        Title, Genre, Platform, Deskripsi, Rating, Author, Link
      });
    }

    if (games.length === 0) {
      return res.status(404).json({
        creator: 'kaizel Kaijs',
        message: 'No matching results found',
      });
    }

    res.status(200).json({
      creator: 'kaizel Kaijs',
      results: games
    });

  } catch (error) {
    res.status(500).json({
      creator: 'kaizel Kaijs',
      error: `Error: ${error.message}`,
    });
  }
};