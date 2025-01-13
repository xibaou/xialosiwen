const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
  const url = req.query.url || "";
  const apiKey = req.query.apiKey;

  // Validasi URL dan API key
  if (!url) {
    return res.status(400).json({
      creator: 'Kaizel Kaijs',
      error: "URL tidak ditemukan. Harap sertakan URL yang valid.",
    });
  }

  if (!apiKey || !allowedApiKeys.includes(apiKey)) {
    return res.status(403).json({
      creator: 'Kaizel Kaijs',
      error: "API key tidak valid atau tidak disediakan!",
    });
  }

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': "Mozilla/5.0 (Linux; Android 12; SAMSUNG SM-S908B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/17.0 Chrome/96.0.4664.104 Mobile Safari/537.36",
        'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
      },
    });

    const $ = cheerio.load(response.data);
    const scriptInfo = $('script[data-test-id="leaf-snippet"]').text();
    const scriptVideo = $('script[data-test-id="video-snippet"]').text();

    // Mengolah data
    const info = JSON.parse(scriptInfo || '{}');
    const isVideo = !!scriptVideo;
    const videoUrl = isVideo ? JSON.parse(scriptVideo).contentUrl : null;

    // Respons
    return res.status(200).json({
      creator: 'Kaizel Kaijs',
      status: true,
      isVideo: isVideo,
      info: info,
      image: info.image,
      video: videoUrl,
    });

  } catch (error) {
    // Respons error
    return res.status(500).json({
      creator: 'Kaizel Kaijs',
      status: false,
      error: "Failed to download. " + error.message,
    });
  }
};