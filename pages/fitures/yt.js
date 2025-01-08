const axios = require('axios');
const allowedApiKeys = require("../../declaration/arrayKey.jsx");

module.exports = async (req, res) => {
  const urls = req.query.urls;
  const apiKey = req.query.apiKey;

  // Validasi URL dan API Key
  if (!urls) {
    return res.status(400).json({
      error: "Url yt Nya Mana?"
    });
  }

  if (!apiKey || !allowedApiKeys.includes(apiKey)) {
    return res.status(403).json({
      error: "Input Parameter Apikey !"
    });
  }

  const formatAudio = ['mp3', 'm4a', 'webm', 'acc', 'flac', 'opus', 'ogg', 'wav', '4k'];
  const formatVideo = ['360', '480', '720', '1080', '1440'];

  // Fungsi untuk mendownload video
  const ddownr = {
    download: async (url, format) => {
      try {
        const response = await axios.get(`https://p.oceansaver.in/ajax/download.php?copyright=0&format=${format}&url=${url}`, {
          headers: {
            'User-Agent': 'MyApp/1.0',
            'Referer': 'https://ddownr.com/enW7/youtube-video-downloader'
          },
          timeout: 30000 // Timeout setelah 30 detik
        });

        const data = response.data;
        const media = await ddownr.cekProgress(data.id);

        // Menyusun respons sukses dengan informasi tambahan
        return {
          success: true,
          format: format,
          creator: 'kaizel', // Menambahkan informasi pembuat
          'channel whatsapp': 'https://whatsapp.com/channel/0029VanrndJICVfcrjFr3x2R', // Menambahkan link channel WhatsApp
          title: data.title,
          thumbnail: data.info.image,
          downloadUrl: media
        };
      } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
        return { success: false, message: error.message };
      }
    },

    cekProgress: async (id) => {
      try {
        const progressResponse = await axios.get(`https://p.oceansaver.in/ajax/progress.php?id=${id}`, {
          headers: {
            'User-Agent': 'MyApp/1.0',
            'Referer': 'https://ddownr.com/enW7/youtube-video-downloader'
          },
          timeout: 30000 // Timeout setelah 30 detik
        });

        const data = progressResponse.data;

        if (data.progress === 1000) {
          return data.download_url;
        } else {
          console.log('Masih belum selesai wak Info dari pusat nya..');
          await new Promise(resolve => setTimeout(resolve, 1000));
          return ddownr.cekProgress(id);
        }
      } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
        return { success: false, message: error.message };
      }
    }
  };

  // Menentukan format video atau audio yang dipilih
  const format = req.query.format || '480'; // Default format '480'

  // Mendownload dengan URL dan format yang diberikan
  const result = await ddownr.download(urls, format);

  // Mengembalikan respons dengan data yang telah diproses
  return res.status(result.success ? 200 : 500).json(result);
};
