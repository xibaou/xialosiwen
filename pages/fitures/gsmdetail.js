const axios = require('axios');
const cheerio = require('cheerio');
const allowedApiKeys = require("../../declaration/arrayKey.jsx");

module.exports = async (req, res) => {
  const url = req.query.url || "";
  const apiKey = req.query.apiKey;

  // Validasi input URL
  if (!url) {
    return res.status(400).json({
      error: "URL perangkat harus disediakan!",
    });
  }

  // Validasi API Key
  if (!apiKey || !allowedApiKeys.includes(apiKey)) {
    return res.status(403).json({
      error: "API key tidak valid atau tidak disediakan!",
    });
  }

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const processTable = (table) => {
      const sectionName = $(table).find('th').first().text().trim()
        .toLowerCase()
        .replace(/\s+/g, '_');
      const details = {};

      $(table).find('tr').each((_, row) => {
        const key = $(row).find('.ttl').text().trim()
          .toLowerCase()
          .replace(/\s+/g, '_')
          .replace(/\./g, '_')
          .replace(/[]/g, '');
        let value = $(row).find('.nfo').html();

        if (value) {
          value = value
            .replace(/<br\s*\/?>/g, ' ')
            .replace(/<\/?[^>]+(>|$)/g, '')
            .trim();
        }

        if (key && value) {
          details[key] = value;
        }
      });

      return { sectionName, details };
    };

    const specs = {};
    $('table').each((_, table) => {
      const { sectionName, details } = processTable(table);
      if (sectionName) {
        specs[sectionName] = details;
      }
    });

    const rankid = $('div[id="ranks-list"]');
    const result = {
      url,
      main: {
        title: $('h1.section.nobor').text(),
        image: $('div.specs-cp-pic-rating img').attr('src'),
        release: $('span[data-spec="released-hl"]').text(),
        thickness: $('span[data-spec="body-hl"]').text(),
        os: $('span[data-spec="os-hl"]').text(),
        storage: $('span[data-spec="storage-hl"]').text(),
        popularity: rankid.find('span[id="popularity-vote"] strong').text().trim(),
        hits: rankid.find('span[id="popularity-vote"]').text().split('%')[1]?.trim() || '',
        fans: rankid.find('span[id="fan-vote"] strong').text().trim(),
      },
      ...specs
    };

    // Response sukses
    res.status(200).json({
      creator: "kaizel Kaijs",
      result
    });
  } catch (error) {
    // Error handling
    res.status(500).json({
      error: `Error: ${error.message}`,
    });
  }
};