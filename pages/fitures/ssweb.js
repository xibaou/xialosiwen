const axios = require("axios");
const allowedApiKeys = require("../../declaration/arrayKey.jsx");  // Memuat API keys untuk web

module.exports = async (req, res) => {
  const url = req.query.url || "";
  const device = req.query.device || 'desktop';
  const format = req.query.format || 'jpg';
  const apiKey = req.query.apiKey;  // API key untuk web

  if (!url) {
    return res.status(400).json({
      error: "URL tidak boleh kosong!",
    });
  }

  // Validasi API key untuk web
  if (!apiKey || !allowedApiKeys.includes(apiKey)) {
    return res.status(403).json({
      error: "API key tidak valid atau tidak disediakan!",
    });
  }

  // Menentukan dimensi perangkat yang dipilih
  const dimensionMap = {
    desktop: '1024x768',
    phone: '480x800',
    tablet: '800x1280',
    tv: '1920x1080',
  };

  // Memeriksa format gambar
  const validFormats = ['jpg', 'png', 'gif'];
  if (!validFormats.includes(format)) {
    return res.status(400).json({
      error: `Format tidak valid. Pilih salah satu: ${validFormats.join(', ')}`,
    });
  }

  // Memeriksa apakah device valid
  if (!dimensionMap[device]) {
    return res.status(400).json({
      error: `Perangkat tidak valid. Pilih salah satu: desktop, phone, tablet, tv.`,
    });
  }

  // API key untuk screenshot
  const screenshotApiKey = '866c95';  // API key khusus untuk screenshot

  const base = 'https://api.screenshotmachine.com';
  const params = new URLSearchParams({
    key: screenshotApiKey,  // API key untuk screenshot
    url: url,
    device: device,
    dimension: dimensionMap[device],
    format: format,
    cacheLimit: '0',
  });

  const screenshotUrl = `${base}?${params.toString()}`;

  try {
    const response = await axios.head(screenshotUrl);
    if (response.status === 200) {
      res.status(200).json({
        creator: 'Kaizel Kaijs',
        message: 'Screenshot berhasil diambil',
        link: screenshotUrl,
      });
    } else {
      throw new Error('Link screenshot tidak valid.');
    }
  } catch (error) {
    res.status(500).json({
      creator: 'Kaizel Kaijs',
      error: `Error mengambil screenshot: ${error.message}`,
    });
  }
};