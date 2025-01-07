/*
 * by kaizel jskai
 * don't delete my wm
 * follow more on Instagram: @iqstore78
 */
const axios = require("axios");
const allowedApiKeys = require("../../declaration/arrayKey.jsx");

// Fungsi untuk menghasilkan random RID
function generateRandomRid() {
  return Math.random().toString(36).substring(2, 15);
}

module.exports = async (req, res) => {
  const q = req.query.q || ""; // Query dari user
  const apiKey = req.query.apiKey; // API Key

  if (!q) {
    return res.status(400).json({
      error: "Mau nanya apa lu njir",
    });
  }

  if (!apiKey || !allowedApiKeys.includes(apiKey)) {
    return res.status(403).json({
      error: "Input Parameter Apikey!",
    });
  }

  const rid = generateRandomRid(); // Generate random RID
  const url = `https://search.lepton.run/api/query`;

  const requestData = {
    query: q,
    rid: rid,
  };

  try {
    const response = await axios.post(url, requestData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = response.data;

    res.status(200).json({
      creator: "kaizel jskai", // Nama kreator
      question: q, // Pertanyaan dari user
      answer: data.result || "Tidak ada jawaban yang tersedia", // Jawaban dari API
    });
  } catch (error) {
    res.status(500).json({
      error: error.response ? error.response.data : "Ada masalah, coba lagi nanti",
    });
  }
};
