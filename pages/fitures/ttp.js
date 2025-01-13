const axios = require('axios');
const cheerio = require('cheerio');
const allowedApiKeys = require("../../declaration/arrayKey.jsx");

module.exports = async (req, res) => {
  const text = req.query.text || "";
  const apiKey = req.query.apiKey;

  if (!text) {
    return res.status(400).json({
      error: "Teks tidak boleh kosong!",
    });
  }

  if (!apiKey || !allowedApiKeys.includes(apiKey)) {
    return res.status(403).json({
      error: "API key tidak valid atau tidak disediakan!",
    });
  }

  try {
    const response = await axios.post(
      "https://www.picturetopeople.org/p2p/text_effects_generator.p2p/transparent_text_effect",
      new URLSearchParams({
        TextToRender: text,
        FontSize: "100",
        Margin: "30",
        LayoutStyle: "0",
        TextRotation: "0",
        TextColor: "ffffff",
        TextTransparency: "0",
        OutlineThickness: "3",
        OutlineColor: "000000",
        FontName: "Lekton",
        ResultType: "view",
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36",
        },
      }
    );

    const $ = cheerio.load(response.data);
    const results = [];

    $('form[name="MyForm"]').each((index, formElement) => {
      const resultFile = $(formElement).find('#idResultFile').attr('value');
      const refTS = $(formElement).find('#idRefTS').attr('value');
      results.push({
        creator: 'Kaizel Kaijs',
        url: 'https://www.picturetopeople.org' + resultFile,
        title: refTS
      });
    });

    res.status(200).json({
      creator: 'Kaizel Kaijs',
      results: results
    });
  } catch (error) {
    res.status(500).json({
      creator: 'Kaizel Kaijs',
      error: `Error processing the request: ${error.message}`,
    });
  }
};