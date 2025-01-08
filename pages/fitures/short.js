/*
 * by kaizel jskai
 * don't delete my wm
 * follow more on Instagram: @iqstore78
 */
const fetch = require("node-fetch");
const allowedApiKeys = require("../../declaration/arrayKey.jsx");

module.exports = async (req, res) => {
  const url = req.query.url || ""; // URL yang akan diperpendek
  const apiKey = req.query.apiKey;

  if (!url) {
    return res.status(400).json({
      error: "URL apa yang ingin dipendekkan?",
    });
  }

  if (!apiKey || !allowedApiKeys.includes(apiKey)) {
    return res.status(403).json({
      error: "Input Parameter Apikey!",
    });
  }

  // Fungsi pemendek URL menggunakan beberapa layanan
  const shortenMethods = [
    { name: "TinyURL", method: tinyurl },
    { name: "CleanURI", method: cleanuri },
    { name: "1pt", method: onept },
    { name: "is.gd", method: isgd }, // Menambahkan is.gd
    { name: "v.gd", method: vgd },   // Menambahkan v.gd
  ];

  const results = await Promise.all(
    shortenMethods.map(async (service) => {
      try {
        const shortUrl = await service.method(url);
        return { name: service.name, shortUrl };
      } catch {
        return { name: service.name, shortUrl: "Gagal memperpendek URL" };
      }
    })
  );

  res.status(200).json({
    creator: "KaizelJS", // Menyertakan nama kreator
    version: "1.0.2",    // Versi API
    original_url: url,
    short_urls: results,
    message: "Powered by KaizelJS - Stylish URL Shortener",
  });
};

// Fungsi layanan pemendek URL
async function tinyurl(url) {
  const response = await fetch(`https://tinyurl.com/api-create.php?url=${url}`);
  return await response.text();
}

async function cleanuri(url) {
  const response = await fetch("https://cleanuri.com/api/v1/shorten", {
    method: "POST",
    body: new URLSearchParams({ url }),
  });
  const result = await response.json();
  return result.result_url;
}

async function onept(url) {
  const response = await fetch(`https://csclub.uwaterloo.ca/~phthakka/1pt/addURL.php?url=${encodeURIComponent(url)}`);
  const result = await response.json();
  return `https://1pt.co/${result.short}`;
}

async function isgd(url) {
  const response = await fetch(`https://is.gd/create.php?format=json&url=${url}`);
  const result = await response.json();
  return result.shorturl;
}

async function vgd(url) {
  const response = await fetch(`https://v.gd/create.php?format=json&url=${url}`);
  const result = await response.json();
  return result.shorturl;
}
