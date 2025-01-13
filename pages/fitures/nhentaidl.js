const axios = require('axios');
const cheerio = require('cheerio');
const allowedApiKeys = require("../../declaration/arrayKey.jsx");

module.exports = async (req, res) => {
  const { id } = req.query;
  const apiKey = req.query.apiKey;

  // Validasi input
  if (!id) {
    return res.status(400).json({
      creator: "Kaizel Kaijs",
      error: "ID tidak ditemukan. Harap sertakan ID yang valid.",
    });
  }

  if (!apiKey || !allowedApiKeys.includes(apiKey)) {
    return res.status(403).json({
      creator: "Kaizel Kaijs",
      error: "API key tidak valid atau tidak disediakan!",
    });
  }

  const mainUrl = `https://nhentai.net/g/${id}/`;
  const imageUrls = [];

  try {
    // Fetch main page
    const { data } = await axios.get(mainUrl);
    const $ = cheerio.load(data);

    // Extract title
    const title = $('h1.title').text().trim();

    // Extract thumbnail
    const thumbnail = $('meta[property="og:image"]').attr('content');

    // Extract tags
    const tags = [];
    $('span.name').each((index, element) => {
      tags.push($(element).text().trim());
    });

    // Extract number of pages
    const pages = parseInt($('.tag-container:contains("Pages:") .name').text()) || 0;

    // Extract gallery ID from thumbnail URL
    const galleryMatch = thumbnail?.match(/galleries\/(\d+)/);
    const galleryId = galleryMatch ? galleryMatch[1] : null;

    // If we have gallery ID and pages count, construct image URLs
    if (galleryId && pages > 0) {
      // Determine image server (t.nhentai.net)
      const serverNum = Math.floor(Math.random() * 5) + 1; // t1 to t5

      // Generate URLs for all pages
      for (let i = 1; i <= pages; i++) {
        const imageUrl = `https://t${serverNum}.nhentai.net/galleries/${galleryId}/${i}.jpg`;
        imageUrls.push(imageUrl);
      }
    }

    // Get metadata
    const metadata = {
      id,
      title,
      thumbnail,
      tags,
      pages,
      galleryId,
      uploadDate: $('.tag-container:contains("Uploaded:") time').attr('datetime'),
      favorites: parseInt($('.btn-primary .nobold').text().match(/\d+/)?.[0] || '0'),
      artist: $('.tag-container:contains("Artists:") .name').first().text(),
      group: $('.tag-container:contains("Groups:") .name').first().text(),
      languages: $('.tag-container:contains("Languages:") .name')
        .map((_, el) => $(el).text())
        .get(),
      category: $('.tag-container:contains("Categories:") .name').first().text(),
    };

    // Respons sukses
    res.status(200).json({
      creator: "Kaizel Kaijs",
      status: true,
      result: {
        ...metadata,
        imageUrls,
      },
    });
  } catch (error) {
    // Respons error
    res.status(500).json({
      creator: "Kaizel Kaijs",
      status: false,
      error: `Gagal mengambil data dari NHentai: ${error.message}`,
    });
  }
};