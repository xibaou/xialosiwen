const axios = require('axios');
const cheerio = require('cheerio');
const allowedApiKeys = require("../../declaration/arrayKey.jsx");

module.exports = async (req, res) => {
  const username = req.query.username || "";
  const apiKey = req.query.apiKey;

  if (!username) {
    return res.status(400).json({
      error: "Username tidak boleh kosong!",
    });
  }

  if (!apiKey || !allowedApiKeys.includes(apiKey)) {
    return res.status(403).json({
      error: "API key tidak valid atau tidak disediakan!",
    });
  }

  try {
    const profileResponse = await axios.get(`https://api.github.com/users/${username}`);
    const profileData = profileResponse.data;
    const reposResponse = await axios.get(profileData.repos_url);
    const reposData = reposResponse.data;
    const followersResponse = await axios.get(profileData.followers_url);
    const followingResponse = await axios.get(profileData.following_url.replace('{/other_user}', ''));
    const followersData = followersResponse.data.slice(0, 5);
    const followingData = followingResponse.data.slice(0, 5);

    const oldestRepos = reposData.slice().sort((a, b) => new Date(a.created_at) - new Date(b.created_at)).slice(0, 5);
    const newestRepos = reposData.slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);
    const popularRepos = reposData.slice().sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 5);
    const leastStarredRepos = reposData.slice().sort((a, b) => a.stargazers_count - b.stargazers_count).slice(0, 5);

    let summary = `Profil GitHub: ${profileData.name || profileData.login}\n`;
    summary += `Bio: ${profileData.bio || 'Tidak ada bio'}\n`;
    summary += `Followers: ${profileData.followers}\n`;
    summary += `Following: ${profileData.following}\n`;

    summary += `\n🔹 Orang yang Di-follow (5 Teratas):\n`;
    followingData.forEach(user => {
      summary += `- ${user.login} (Profile URL: ${user.html_url})\n`;
    });

    summary += `\n🔹 Followers (5 Teratas):\n`;
    followersData.forEach(user => {
      summary += `- ${user.login} (Profile URL: ${user.html_url})\n`;
    });

    summary += `\n🔹 Repository Terlama:\n`;
    oldestRepos.forEach(repo => {
      summary += `- ${repo.name}\n`;
      summary += `  Deskripsi: ${repo.description || 'Tidak ada deskripsi'}\n`;
      summary += `  Dibuat: ${repo.created_at}\n`;
      summary += `  Stars: ${repo.stargazers_count}\n\n`;
    });

    summary += `\n🔹 Repository Terbaru:\n`;
    newestRepos.forEach(repo => {
      summary += `- ${repo.name}\n`;
      summary += `  Deskripsi: ${repo.description || 'Tidak ada deskripsi'}\n`;
      summary += `  Dibuat: ${repo.created_at}\n`;
      summary += `  Stars: ${repo.stargazers_count}\n\n`;
    });

    summary += `\n🔹 Repository Terpopuler:\n`;
    popularRepos.forEach(repo => {
      summary += `- ${repo.name}\n`;
      summary += `  Deskripsi: ${repo.description || 'Tidak ada deskripsi'}\n`;
      summary += `  Dibuat: ${repo.created_at}\n`;
      summary += `  Stars: ${repo.stargazers_count}\n\n`;
    });

    summary += `\n🔹 Repository dengan Bintang Ter-sedikit:\n`;
    leastStarredRepos.forEach(repo => {
      summary += `- ${repo.name}\n`;
      summary += `  Deskripsi: ${repo.description || 'Tidak ada deskripsi'}\n`;
      summary += `  Dibuat: ${repo.created_at}\n`;
      summary += `  Stars: ${repo.stargazers_count}\n\n`;
    });

    res.status(200).json({
      creator: 'Kaizel Kaijs',
      summary: summary
    });
  } catch (error) {
    res.status(500).json({
      creator: 'Kaizel Kaijs',
      error: `Error fetching data: ${error.message}`,
    });
  }
};