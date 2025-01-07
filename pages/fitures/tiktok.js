/*
 * Created by Kaizel Jeskai
 * Jangan hapus watermark ini
 * Follow lebih banyak di Instagram: @iqstore78
 */
const axios = require("axios");
const allowedApiKeys = require("../../declaration/arrayKey.jsx");

module.exports = async (req, res) => {
  const urls = req.query.urls;
  const apiKey = req.query.apiKey;

  if (!urls) {
    return res.status(400).json({
      error: "Url Tiktok Nya Mana?"
    });
  }

  if (!apiKey || !allowedApiKeys.includes(apiKey)) {
    return res.status(403).json({
      error: "Input Parameter Apikey!"
    });
  }

  const url = `https://tikwm.com/api/`;
  const encodedParams = new URLSearchParams();
  encodedParams.set("url", urls);
  encodedParams.set("hd", "1");

  try {
    const response = await axios.post(url, encodedParams, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Cookie": "current_language=en",
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36"
      }
    });

    const videos = response.data.data;

    if (!videos) {
      return res.status(404).json({
        error: "Data video tidak ditemukan"
      });
    }

    // Memisahkan hashtag dari title
    const rawTitle = videos.title || "Tidak ada judul";
    const hashtags = rawTitle.match(/#[\w]+/g) || [];
    const cleanTitle = rawTitle.replace(/#[\w]+/g, "").trim();

    // Mengambil semua data penting
    const result = {
      creator: "Kaizel Jeskai",
      title: cleanTitle || "Tidak ada judul",
      description: videos.desc || "Tidak ada deskripsi",
      hashtags: hashtags,
      no_watermark: videos.play || null,
      watermark: videos.wmplay || null,
      music: {
        title: videos.music_info?.title || "Tidak diketahui",
        author: videos.music_info?.author || "Tidak diketahui",
        url: videos.music_info?.play_url || null
      },
      stats: {
        likes: videos.digg_count || 0,
        comments: videos.comment_count || 0,
        shares: videos.share_count || 0,
        plays: videos.play_count || 0,
        favorites: videos.collect_count || 0
      },
      duration: videos.duration || 0,
      create_time: videos.create_time || 0,
      uploader: {
        username: videos.author?.username || "Tidak diketahui",
        nickname: videos.author?.nickname || "Tidak diketahui",
        avatar: videos.author?.avatar || null,
        followers: videos.author?.followers_count || 0,
        following: videos.author?.following_count || 0,
        verified: videos.author?.verified || false
      },
      video: {
        format: videos.format || "Tidak diketahui",
        resolution: videos.resolution || "Tidak diketahui",
        ratio: videos.ratio || "Tidak diketahui",
        cover: videos.cover || null,
        origin_cover: videos.origin_cover || null
      }
    };

    // Mengembalikan respons JSON
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching TikTok video:", error);
    res.status(500).json({
      error: "Ada masalah, coba lagi nanti"
    });
  }
};
