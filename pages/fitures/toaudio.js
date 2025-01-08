/*
 * by kaizel jskai
 * don't delete my wm
 * follow more on Instagram: @iqstore78
 */
const axios = require("axios");
const allowedApiKeys = require("../../declaration/arrayKey.jsx");

async function tiktokTts(text) {
  try {
    const modelVoice = "en_us_006"; // English US Male 1
    const { data } = await axios.post(
      "https://tiktok-tts.weilnet.workers.dev/api/generation",
      { text: text, voice: modelVoice },
      { headers: { "content-type": "application/json" } }
    );
    return data; // Mengembalikan hasil data audio
  } catch (err) {
    console.error("API Error:", err.response?.data || err.message);
    return null; // Mengembalikan null jika terjadi error
  }
}

module.exports = async (req, res) => {
  const text = req.query.text || ""; // Teks untuk diubah menjadi suara
  const apiKey = req.query.apiKey; // API Key

  if (!text) {
    return res.status(400).json({
      error: "Masukkan teks untuk diubah menjadi suara!",
    });
  }

  if (!apiKey || !allowedApiKeys.includes(apiKey)) {
    return res.status(403).json({
      error: "Input Parameter Apikey!",
    });
  }

  try {
    // Panggil fungsi tiktokTts untuk menghasilkan audio
    const audioData = await tiktokTts(text);
    if (!audioData || !audioData.audio) {
      return res.status(500).json({
        error: "Gagal menghasilkan audio!",
      });
    }

    // Kembalikan respons dengan data audio
    res.status(200).json({
      creator: "kaizel jskai", // Nama kreator
      text: text, // Teks input
      audio_base64: audioData.audio, // Audio dalam format Base64
    });
  } catch (error) {
    console.error("Endpoint Error:", error.message);
    res.status(500).json({
      error: "Ada masalah, coba lagi nanti",
    });
  }
};
