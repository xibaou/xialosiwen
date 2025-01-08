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
    { name: "is.gd", method: isgd },
    { name: "v.gd", method: vgd },
    { name: "GoTiny", method: gotiny },
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
    creator: "kaizel jskai", // Menambahkan nama kreator
    original_url: url,
    short_urls: results,
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

async function gotiny(url) {
  const response = await fetch("https://gotiny.cc/api", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input: url }),
  });
  const result = await response.json();
  return `https://gotiny.cc/${result[0]?.code}`;
}
