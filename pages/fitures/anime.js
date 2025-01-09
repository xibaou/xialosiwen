/*
 * by kaizel jskai
 * don't delete my wm
 * follow more on Instagram: @iqstore78
 */

const axios = require("axios");
const allowedApiKeys = require("../../declaration/arrayKey.jsx"); // Tempatkan daftar API keys yang diperbolehkan

module.exports = async (req, res) => {
  const query = req.query.query || ""; // Query pencarian anime
  const apiKey = req.query.apiKey; // API Key untuk autentikasi

  // Memastikan query tidak kosong
  if (!query) {
    return res.status(400).json({
      error: "Query pencarian anime diperlukan!",
    });
  }

  // Memastikan API key valid
  if (!apiKey || !allowedApiKeys.includes(apiKey)) {
    return res.status(403).json({
      error: "Input Parameter Apikey!",
    });
  }

  // URL AniList GraphQL API
  const url = "https://graphql.anilist.co";

  // Query GraphQL untuk pencarian anime
  const graphqlQuery = {
    query: `
      query ($search: String) {
        Media(search: $search, type: ANIME) {
          id
          title {
            romaji
            english
            native
          }
          description
          coverImage {
            large
          }
          episodes
          status
          genres
          averageScore
          siteUrl
        }
      }
    `,
    variables: {
      search: query,
    },
  };

  try {
    // Melakukan permintaan ke AniList GraphQL API
    const { data } = await axios.post(url, graphqlQuery, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Jika tidak ada hasil
    if (!data.data.Media) {
      return res.status(404).json({
        error: "Anime tidak ditemukan!",
      });
    }

    // Menyusun hasil pencarian
    const anime = data.data.Media;
    res.status(200).json({
      creator: "kaizel jskai",
      query: query,
      results: {
        id: anime.id,
        title: anime.title,
        description: anime.description,
        coverImage: anime.coverImage.large,
        episodes: anime.episodes,
        status: anime.status,
        genres: anime.genres,
        averageScore: anime.averageScore,
        siteUrl: anime.siteUrl,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: "Terjadi kesalahan saat mengambil data dari AniList.",
    });
  }
};