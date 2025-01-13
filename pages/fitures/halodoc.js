const axios = require('axios');
const cheerio = require('cheerio');
const allowedApiKeys = require("../../declaration/arrayKey.jsx");

module.exports = async (req, res) => {
  const query = req.query.query || ""; // Parameter untuk kata kunci pencarian
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
    // Ambil data dari Halodoc
    const { data, status } = await axios.get(`https://www.halodoc.com/artikel/search/${query}`);
    const $ = cheerio.load(data);

    const hasil = [];

    // Memproses setiap artikel
    $('.article-card.default-view').each((index, element) => {
      const judul = $(element).find('header a').text().trim() || 'Judul tidak ditemukan';
      const tautan = $(element).find('header a').attr('href') 
        ? `https://www.halodoc.com${$(element).find('header a').attr('href')}`
        : 'Tautan tidak ditemukan';
      const deskripsi = $(element).find('.description').text().trim() || 'Deskripsi tidak tersedia';
      const kategori = $(element)
        .find('.tag-container a')
        .map((i, el) => $(el).text().trim())
        .get();
      const gambar = $(element).find('.hd-base-image-mapper__img').attr('src') || 'Gambar tidak tersedia';

      // Menyusun data untuk artikel ini
      hasil.push({
        judul,
        tautan,
        deskripsi,
        kategori: kategori.length > 0 ? kategori : ['Kategori tidak tersedia'],
        gambar,
      });
    });

    if (hasil.length === 0) {
      return res.status(404).json({
        creator: 'kaizel Kaijs',
        message: 'Tidak ditemukan artikel yang sesuai',
      });
    }

    res.status(200).json({
      creator: 'kaizel Kaijs',
      results: hasil
    });
  } catch (error) {
    res.status(500).json({
      error: "Ada masalah, coba lagi nanti",
    });
  }
};