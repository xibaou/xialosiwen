/*
 * by kaizel jskai
 * don't delete my wm
 * follow more on Instagram: @iqstore78
 */
const axios = require("axios");
const allowedApiKeys = require("../../declaration/arrayKey.jsx");

// Fungsi untuk membuat gambar berdasarkan prompt
module.exports = async (req, res) => {
  const prompt = req.query.prompt || ""; // Prompt untuk menghasilkan gambar
  const apiKey = req.query.apiKey; // API Key

  if (!prompt) {
    return res.status(400).json({
      error: "Masukkan prompt untuk menghasilkan gambar!",
    });
  }

  if (!apiKey || !allowedApiKeys.includes(apiKey)) {
    return res.status(403).json({
      error: "Input Parameter Apikey!",
    });
  }

  const url = "https://www.aiallin.online/loader.php";
  
  try {
    const form = new FormData();
    form.append("prompt", prompt);

    const response = await axios.post(url, form, {
      headers: form.getHeaders(),
    });

    const data = response.data;

    if (data.status !== "success") {
      return res.status(400).json({
        error: "Gagal menghasilkan gambar!",
      });
    }

    res.status(200).json({
      creator: "kaizel jskai", // Nama kreator
      prompt: prompt, // Prompt yang dimasukkan user
      image: "https://www.aiallin.online" + data.url, // URL gambar hasil
    });
  } catch (error) {
    res.status(500).json({
      error: error.response ? error.response.data : "Ada masalah, coba lagi nanti",
    });
  }
};
