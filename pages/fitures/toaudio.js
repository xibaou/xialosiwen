const axios = require("axios");
const fs = require("fs");
const path = require("path");
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

// Fungsi untuk mengonversi file audio menjadi base64
async function convertAudioToBase64(audioUrl) {
  try {
    const response = await axios.get(audioUrl, { responseType: "arraybuffer" });
    const audioBase64 = Buffer.from(response.data, "binary").toString("base64");
    return audioBase64;
  } catch (err) {
    console.error("Error while converting audio to base64:", err.message);
    return null;
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

    // Jika audio berupa URL, konversi menjadi base64
    const audioBase64 = await convertAudioToBase64(audioData.audio);
    if (!audioBase64) {
      return res.status(500).json({
        error: "Gagal mengonversi audio menjadi base64!",
      });
    }

    // Kembalikan respons dengan data audio dalam base64
    res.status(200).json({
      creator: "kaizel jskai", // Nama kreator
      text: text, // Teks input
      audio_base64: audioBase64, // Audio dalam format Base64
    });
  } catch (error) {
    console.error("Endpoint Error:", error.message);
    res.status(500).json({
      error: "Ada masalah, coba lagi nanti",
    });
  }
};
