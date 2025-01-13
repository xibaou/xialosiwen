const axios = require('axios');
const allowedApiKeys = require("../../declaration/arrayKey.jsx");

module.exports = async (req, res) => {
  const query = req.query.query || "";
  const apiKey = req.query.apiKey;

  // Validasi query dan API key
  if (!query) {
    return res.status(400).json({
      creator: 'Kaizel Kaijs',
      error: "Apa yang ingin Anda cari?",
    });
  }

  if (!apiKey || !allowedApiKeys.includes(apiKey)) {
    return res.status(403).json({
      creator: 'Kaizel Kaijs',
      error: "API key tidak valid atau tidak disediakan!",
    });
  }

  try {
    // Mendapatkan access token dari Spotify
    const access_token = await getAccessToken();

    // Melakukan pencarian lagu di Spotify
    const response = await axios.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const data = response.data;
    const tracks = data.tracks.items.map(item => ({
      name: item.name,
      artists: item.artists.map(artist => artist.name).join(', '),
      popularity: item.popularity,
      link: item.external_urls.spotify,
      image: item.album.images[0].url,
      duration_ms: item.duration_ms,
    }));

    // Jika tidak ada hasil
    if (tracks.length === 0) {
      return res.status(404).json({
        creator: 'Kaizel Kaijs',
        message: 'No matching results found',
      });
    }

    // Mengirim hasil pencarian
    res.status(200).json({
      creator: 'Kaizel Kaijs',
      results: tracks
    });

  } catch (error) {
    res.status(500).json({
      creator: 'Kaizel Kaijs',
      error: `Error: ${error.message}`,
    });
  }
};

// Fungsi untuk mendapatkan access token Spotify
async function getAccessToken() {
  try {
    const client_id = 'acc6302297e040aeb6e4ac1fbdfd62c3';
    const client_secret = '0e8439a1280a43aba9a5bc0a16f3f009';
    const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
    
    const response = await axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    const data = response.data;
    return data.access_token;
  } catch (error) {
    console.error('Error getting Spotify access token:', error);
    throw 'An error occurred while obtaining Spotify access token.';
  }
}