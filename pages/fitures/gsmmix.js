const axios = require('axios');
const cheerio = require('cheerio');
const allowedApiKeys = require("../../declaration/arrayKey.jsx");

const headers = {
    "Content-Type": "application/json; charset=UTF-8",
    "Origin": "https://m.gsmarena.com",
    "Referer": "https://m.gsmarena.com/",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.5993.89 Safari/537.36",
    "X-Requested-With": "XMLHttpRequest"
};

module.exports = async (req, res) => {
    const query = req.query.query || "";
    const apiKey = req.query.apiKey;

    if (!query) {
        return res.status(400).json({
            error: "Masukkan kata kunci pencarian!",
        });
    }

    if (!apiKey || !allowedApiKeys.includes(apiKey)) {
        return res.status(403).json({
            error: "API key tidak valid atau tidak disediakan!",
        });
    }

    try {
        const url = `https://m.gsmarena.com/results.php3`;
        const searchResponse = await axios.get(url, {
            headers,
            params: {
                'sQuickSearch': 'yes',
                'sName': query
            }
        });

        const $search = cheerio.load(searchResponse.data);
        const searchResults = [];

        $search('.general-menu ul li').each((_, li) => {
            const anchor = $search(li).find('a');
            const img = anchor.find('img');
            const name = anchor.find('strong').html();
            if (name) {
                searchResults.push({
                    url: 'https://m.gsmarena.com/' + anchor.attr('href'),
                    image: img.attr('src'),
                    name: name.replace(/\s+/g, ' ').trim()
                });
            }
        });

        if (searchResults.length === 0) {
            return res.status(404).json({
                creator: 'kaizel Kaijs',
                message: 'Hasil tidak ditemukan!',
            });
        }

        const firstResult = searchResults[0];
        const detailResponse = await axios.get(firstResult.url, { headers });
        const $ = cheerio.load(detailResponse.data);

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
                    .replace(/[()]/g, '');

                let value = $(row).find('.nfo').html();
                if (value) {
                    value = value
                        .replace(/<[^>]*>/g, ' ')
                        .replace(/\s+/g, ' ')
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
        const popularityText = rankid.find('span[id="popularity-vote"]').text();
        const hits = popularityText.includes('%') ? popularityText.split('%')[1].trim() : '';

        const result = {
            creator: 'kaizel Kaijs',
            searchResults,
            details: {
                url: firstResult.url,
                main: {
                    title: $('h1.section.nobor').text().trim(),
                    image: $('div.specs-cp-pic-rating').find('img').attr('src'),
                    release: $('span[data-spec="released-hl"]').text().trim(),
                    thickness: $('span[data-spec="body-hl"]').text().trim(),
                    os: $('span[data-spec="os-hl"]').text().trim(),
                    storage: $('span[data-spec="storage-hl"]').text().trim(),
                    popularity: rankid.find('span[id="popularity-vote"] strong').text().trim(),
                    hits: hits,
                    fans: rankid.find('span[id="fan-vote"] strong').text().trim()
                },
                ...specs
            }
        };

        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({
            error: `Error: ${error.message}`,
        });
    }
};