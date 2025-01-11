/*
 * by balxzzy
 * don't delete my wm
 * follow more on Instagram: @balxzzy
 */
const Groq = require('groq-sdk');
const allowedApiKeys = require('../../declaration/arrayKey.jsx'); // Daftar API key yang diizinkan

// Fungsi untuk menghasilkan random RID
function generateRandomRid() {
  return Math.random().toString(36).substring(2, 15);
}

const client = new Groq({ apiKey: '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' });

module.exports = async (req, res) => {
  const q = req.query.q || ""; // Prompt atau pertanyaan dari user
  const apiKey = req.query.apiKey; // API key

  if (!prompt) {
    return res.status(400).json({
      error: "Mau nanya apa lu njir",
    });
  }

  if (!apiKey || !allowedApiKeys.includes(apiKey)) {
    return res.status(403).json({
      error: "API key tidak valid atau tidak disediakan!",
    });
  }

  const rid = generateRandomRid(); // Generate random RID

  try {
    const chatCompletion = await client.chat.completions.create({
      messages: [
        { role: "system", content: "Kamu Adalah kaizel kazami Dengan Memakai Bahasa Indonesia Dan Bergaulan" },
        { role: "user", content: q },
      ],
      model: 'llama3-8b-8192',
    });

    const hasil = chatCompletion.choices[0].message.content;

    res.status(200).json({
      creator: "kaizel kaijs", // Nama kreator
      question: q, // Pertanyaan dari user
      answer: hasil || "Tidak ada jawaban yang tersedia", // Jawaban dari API
      rid: rid, // RID untuk pelacakan
    });
  } catch (error) {
    res.status(500).json({
      error: error.response ? error.response.data : "Ada masalah, coba lagi nanti",
    });
  }
};
