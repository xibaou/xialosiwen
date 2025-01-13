const axios = require('axios');
const cheerio = require('cheerio');
const allowedApiKeys = require("../../declaration/arrayKey.jsx");

module.exports = async (req, res) => {
  const url = req.query.url || "";
  const apiKey = req.query.apiKey;

  // Validasi input
  if (!url) {
    return res.status(400).json({
      creator: "Kaizel Kaijs",
      error: "URL Pastebin tidak ditemukan. Harap sertakan URL yang valid.",
    });
  }

  if (!apiKey || !allowedApiKeys.includes(apiKey)) {
    return res.status(403).json({
      creator: "Kaizel Kaijs",
      error: "API key tidak valid atau tidak disediakan!",
    });
  }

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Ekstrak data
    const title = $('div.info-top h1').text().trim() || "Judul tidak ditemukan";
    const rawLink = $('a[href^="/raw"]').attr('href');
    const downloadLink = $('a[href^="/dl"]').attr('href');

    const content = [];
    $('.source.text ol li').each((i, el) => content.push($(el).text().trim()));

    const username = $('div.username a').text().trim() || "Username tidak ditemukan";
    const datePosted = $('div.date span').text().trim() || "Tanggal tidak ditemukan";
    const viewCount = $('div.visits').text().trim() || "Jumlah tampilan tidak ditemukan";

    // Format respons
    const caption = `🍁 *Ambil Pastebin*\n\n` +
      `📌 *Judul*: ${title}\n` +
      `👤 *Uploader*: ${username}\n` +
      `🗓 *Tanggal*: ${datePosted}\n` +
      `📊 *Tampilan*: ${viewCount}\n\n` +
      `🔗 *Link Raw*: ${rawLink ? `https://pastebin.com${rawLink}` : 'Tidak ditemukan'}\n` +
      `📥 *Link Unduh*: ${downloadLink ? `https://pastebin.com${downloadLink}` : 'Tidak ditemukan'}\n\n` +
      `📝 *Konten*:\n${content.length ? content.join('\n') : 'Tidak ada konten kode ditemukan.'}\n\n`;

    const documentContent = content.join('\n') || "Tidak ada konten untuk disimpan.";

    // Respons sukses
    res.status(200).json({
      creator: "Kaizel Kaijs",
      status: true,
      result: {
        title,
        uploader: username,
        date: datePosted,
        views: viewCount,
        rawLink: rawLink ? `https://pastebin.com${rawLink}` : null,
        downloadLink: downloadLink ? `https://pastebin.com${downloadLink}` : null,
        content: documentContent,
        caption,
      },
    });
  } catch (error) {
    // Respons error
    res.status(500).json({
      creator: "Kaizel Kaijs",
      status: false,
      error: `Gagal mengambil data dari Pastebin: ${error.message}`,
    });
  }
};