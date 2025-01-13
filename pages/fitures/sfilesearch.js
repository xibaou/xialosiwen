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

  const allResults = [];
  let page = 1;

  try {
    while (true) {
      const { data: body } = await axios.get(`https://sfile.mobi/search.php?q=${query}&page=5`, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      });

      const $ = cheerio.load(body);

      let hasResults = false;

      $('div.list').each((_, el) => {
        const title = $(el).find('a').text();
        const filesizeMatch = $(el).text().trim().match(/(.*?)/); // Extract file size
        const filesize = filesizeMatch ? filesizeMatch[1] : "Unknown";
        const link = $(el).find('a').attr('href');

        if (link) {
          allResults.push({
            title: title.trim(),
            filesize,
            link,
          });
          hasResults = true;
        }
      });

      // Stop if no results are found on the page
      if (!hasResults) {
        break;
      }

      page++;
    }

    if (allResults.length === 0) {
      return res.status(404).json({
        creator: "kaizel Kaijs",
        message: "No matching results found",
      });
    }

    res.status(200).json({
      creator: "kaizel Kaijs",
      results: allResults,
    });
  } catch (error) {
    res.status(500).json({
      creator: "kaizel Kaijs",
      error: `Error: ${error.message}`,
    });
  }
};