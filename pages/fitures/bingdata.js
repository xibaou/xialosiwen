const axios = require('axios');
const cheerio = require('cheerio');
const allowedApiKeys = require("../../declaration/arrayKey.jsx"); // Import API keys

const bing = {
  imageAndVideoSearch: async (query) => {
    try {
      // Pencarian Gambar
      const imagesResponse = await axios.get(`https://www.bing.com/images/search?q=${encodeURIComponent(query)}`);
      const imagesHtml = imagesResponse.data;
      const $images = cheerio.load(imagesHtml);
      const imageResults = [];

      $images('.imgpt > a').each((index, el) => {
        const imagePath = $images(el).attr('href');
        if (imagePath) {
          imageResults.push({
            photo: `https://www.bing.com${imagePath.trim()}`,
          });
        }
      });

      // Pencarian Video
      const videosResponse = await axios.get(`https://www.bing.com/videos/search?q=${encodeURIComponent(query)}`);
      const videosHtml = videosResponse.data;
      const $videos = cheerio.load(videosHtml);
      const videoResults = [];

      $videos('.mc_vtvc').each((index, element) => {
        const title = $videos(element).find('.mc_vtvc_title strong').text();
        const duration = $videos(element).find('.mc_bc_rc.items').first().text();
        const views = $videos(element).find('.meta_vc_content').first().text();
        const uploadDate = $videos(element).find('.meta_pd_content').first().text();
        const channel = $videos(element).find('.mc_vtvc_meta_row_channel').text();
        const link = $videos(element).find('a').attr('href');

        videoResults.push({
          title: title.trim(),
          duration: duration.trim(),
          views: views.trim(),
          uploadDate: uploadDate.trim(),
          channel: channel.trim(),
          link: link ? `https://www.bing.com${link.trim()}` : undefined,
        });
      });

      return {
        status: true,
        imageResults,
        videoResults,
      };
    } catch (error) {
      throw new Error('Error during image and video search: ' + error.message);
    }
  },
};

module.exports = async (req, res) => {
  const query = req.query.query || ''; // Get query parameter
  const apiKey = req.query.apiKey; // Get API key

  // Validasi query
  if (!query) {
    return res.status(400).json({
      error: 'Search query is required!',
    });
  }

  // Validasi API key
  if (!apiKey || !allowedApiKeys.includes(apiKey)) {
    return res.status(403).json({
      error: 'Invalid API key!',
    });
  }

  try {
    const results = await bing.imageAndVideoSearch(query);

    if (results.status) {
      res.status(200).json({
        creator: 'kaizel jskai',
        query: query,
        images: results.imageResults,
        videos: results.videoResults,
      });
    } else {
      res.status(500).json({
        error: 'Failed to fetch Bing data.',
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message || 'An error occurred while processing the request.',
    });
  }
};
