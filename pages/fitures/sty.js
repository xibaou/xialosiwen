/*
   * by kaiapi
   * Dont delete my wm
   * Powered by KaiAPI, the stylish text converter
   * Follow on Instagram: @iqstore78
   * Version: 1.0.1
*/
const axios = require("axios");
const cheerio = require("cheerio");

function styletext(teks) {
  return new Promise((resolve, reject) => {
    if (!teks.trim()) {
      return reject(new Error("Teks tidak boleh kosong"));
    }

    axios
      .get("http://qaz.wtf/u/convert.cgi?text=" + encodeURIComponent(teks))
      .then(({ data }) => {
        const $ = cheerio.load(data);
        const hasil = [];

        $("table > tbody > tr").each(function (a, b) {
          hasil.push({
            name: $(b).find("td:nth-child(1) > span").text(),
            result: $(b).find("td:nth-child(2)").text().trim(),
          });
        });

        resolve(hasil);
      })
      .catch((error) => reject(new Error("Gagal mengambil data: " + error.message)));
  });
}

module.exports = async (req, res) => {
  const q = req.query.q || "";

  if (!q.trim()) {
    return res.status(400).json({
      error: "Mau nulis apa",
    });
  }

  try {
    const hasil = await styletext(q);
    res.status(200).json({
      data: hasil,
      info: "Powered by KaiAPI | Styled text converter v1.0.1", // Informasi lebih kreatif
    });
  } catch (error) {
    res.status(500).json({
      error: "Ada masalah, coba lagi nanti: " + error.message,
    });
  }
};
