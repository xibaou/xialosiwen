/*
 * by kaizel jskai
 * don't delete my wm
 * follow more on Instagram: @iqstore78
 */
const gtts = require("node-gtts")("en"); // Bahasa default Inggris
const allowedApiKeys = require("../../declaration/arrayKey.jsx");

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
    // Nama file unik untuk audio
    const fileName = `output-${Date.now()}.mp3`;

    // URL publik untuk file audio
    const audioUrl = `${req.protocol}://${req.get("host")}/${fileName}`;

    // Simpan file audio ke direktori root proyek
    gtts.save(fileName, text, (err) => {
      if (err) {
        return res.status(500).json({
          error: "Gagal menghasilkan audio!",
        });
      }

      res.status(200).json({
        creator: "kaizel jskai", // Nama kreator
        text: text, // Teks input
        audio_url: audioUrl, // URL file audio
      });

      // Hapus file setelah beberapa waktu (opsional)
      setTimeout(() => {
        require("fs").unlink(fileName, (err) => {
          if (err) console.error("Gagal menghapus file:", fileName);
        });
      }, 60000); // File akan dihapus setelah 1 menit
    });
  } catch (error) {
    res.status(500).json({
      error: "Ada masalah, coba lagi nanti",
    });
  }
};
