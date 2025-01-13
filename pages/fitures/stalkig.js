const axios = require("axios");
const cheerio = require("cheerio");
const allowedApiKeys = require("../../declaration/arrayKey.jsx");

module.exports = async (req, res) => {
  const username = req.query.username || "";
  const apiKey = req.query.apiKey;

  // Validasi input
  if (!username) {
    return res.status(400).json({
      creator: "Kaizel Kaijs",
      error: "Nama pengguna tidak ditemukan. Harap sertakan username yang valid.",
    });
  }

  if (!apiKey || !allowedApiKeys.includes(apiKey)) {
    return res.status(403).json({
      creator: "Kaizel Kaijs",
      error: "API key tidak valid atau tidak disediakan!",
    });
  }

  const url = `https://greatfon.io/v/${encodeURIComponent(username)}`;

  try {
    // Ambil data dari URL
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://greatfon.io",
      },
    });

    const $ = cheerio.load(data);

    // Ekstrak data
    const name = $("h1.text-4xl").text().trim() || "Tidak ditemukan";
    const bio = $(".items-top .text-sm").text().trim() || "Tidak ada bio";
    const totalPost = $('.stat-title:contains("Posts")')
      .siblings(".stat-value")
      .text()
      .trim() || "0";
    const totalFollowers = $('.stat-title:contains("Followers")')
      .siblings(".stat-value")
      .text()
      .trim() || "0";
    const profilePic = $("figure img").attr("src") || "https://via.placeholder.com/150";

    // Respons sukses
    return res.status(200).json({
      creator: "Kaizel Kaijs",
      status: true,
      result: {
        username: name,
        bio: bio,
        total_posts: totalPost,
        total_followers: totalFollowers,
        profile_picture: profilePic,
      },
    });
  } catch (error) {
    // Respons error
    return res.status(500).json({
      creator: "Kaizel Kaijs",
      status: false,
      error: `Gagal mengambil data: ${error.message}`,
    });
  }
};