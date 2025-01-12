const axios = require('axios');
const cheerio = require('cheerio');
const allowedApiKeys = require('../../declaration/arrayKey.jsx');

module.exports = async (req, res) => {
  const apiKey = req.query.apiKey;

  if (!apiKey || !allowedApiKeys.includes(apiKey)) {
    return res.status(403).json({
      error: "API key tidak valid atau tidak disediakan!",
    });
  }

  try {
    const response = await axios.get('https://21cineplex.com/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const html = response.data;
    const $ = cheerio.load(html);

    const results = [];

    $('.col-3 .movie').each((index, element) => {
      const movieTitle = $(element).find('.movie-desc h4').text().trim();
      const movieLabel = $(element).find('.movie-desc span.movie-label img').attr('src');
      const moviePoster = $(element).find('.movie-poster img').attr('src');
      const movieLink = $(element).find('a').attr('href');

      if (movieTitle && moviePoster && movieLink) {
        results.push({
          title: movieTitle,
          label: movieLabel || 'No Label',
          poster: moviePoster.startsWith('http') ? moviePoster : `https://21cineplex.com${moviePoster}`,
          link: movieLink.startsWith('http') ? movieLink : `https://21cineplex.com${movieLink}`
        });
      }
    });

    res.status(200).json({
      creator: "kaizel kaijs",
      result: results.length > 0 ? results : "Tidak ada film yang ditemukan",
    });
  } catch (error) {
    res.status(500).json({
      error: error.response ? error.response.data : "Ada masalah, coba lagi nanti",
    });
  }
};
