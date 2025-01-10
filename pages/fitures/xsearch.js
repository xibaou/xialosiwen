/*
 * by kaizel jskai
 * don't delete my wm
 * follow more on Instagram: @iqstore78
 */

const axios = require('axios');
const cheerio = require('cheerio');
const allowedApiKeys = require("../../declaration/arrayKey.jsx"); // Tempatkan daftar API keys yang diperbolehkan

// Fungsi utama untuk melakukan scraping pencarian di XNXX
async function scrapeXNXXSearch(query, filter) {
    try {
        const url = `https://www.xnxx.com/search/${encodeURIComponent(query)}${filter ? filter : ''}`;
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const results = [];
        $('.thumb-block').each((index, element) => {
            const title = $(element).find('.thumb-under a').attr('title');
            const link = 'https://www.xnxx.com' + $(element).find('.thumb-under a').attr('href');
            const thumbnail = $(element).find('img').attr('data-src');

            if (title && link && thumbnail) {
                results.push({ title, link, thumbnail });
            }
        });

        return results;
    } catch (error) {
        console.error('Error scraping:', error.message);
        return [];
    }
}

module.exports = async (req, res) => {
    const query = req.query.query || ""; // Query pencarian
    const apiKey = req.query.apiKey; // API Key untuk autentikasi

    // Memastikan query tidak kosong
    if (!query) {
        return res.status(400).json({
            error: "Query pencarian diperlukan!",
        });
    }

    // Memastikan API key valid
    if (!apiKey || !allowedApiKeys.includes(apiKey)) {
        return res.status(403).json({
            error: "Input Parameter Apikey!",
        });
    }

    try {
        // Memanggil fungsi scraping untuk XNXX
        const results = await scrapeXNXXSearch(query);

        if (results.length === 0) {
            return res.status(404).json({
                error: "Hasil pencarian tidak ditemukan!",
            });
        }

        // Mengirimkan semua hasil pencarian tanpa batas
        return res.status(200).json({
            creator: "kaizel jskai",
            query: query,
            results: results,
        });
    } catch (error) {
        res.status(500).json({
            error: "Terjadi kesalahan dalam pencarian XNXX.",
        });
    }
};
