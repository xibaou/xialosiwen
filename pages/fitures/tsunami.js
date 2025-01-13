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
    const response = await axios.get('https://www.bmkg.go.id/tsunami/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const html = response.data;
    const $ = cheerio.load(html);

    const tsunamiData = [];

    $('table').each((i, table) => {
      $(table).find('tr').each((j, row) => {
        const rowData = [];
        $(row).find('td').each((k, cell) => {
          rowData.push($(cell).text().trim());
        });
        if (rowData.length > 0) {
          tsunamiData.push(rowData);
        }
      });
    });

    const formattedData = tsunamiData.map(row => row.join(', ')).join('\n\n');

    res.status(200).json({
      creator: "kaizel kaijs",
      result: formattedData.length > 0 ? formattedData : "Tidak ada data tsunami yang ditemukan",
    });

  } catch (error) {
    res.status(500).json({
      error: error.response ? error.response.data : "Ada masalah, coba lagi nanti",
    });
  }
};