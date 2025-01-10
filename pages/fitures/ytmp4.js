const axios = require("axios");
const allowedApiKeys = require("../../declaration/arrayKey.jsx"); // Ganti dengan path ke file API key Anda

async function getYoutubeDetails(url) {
  try {
    const response = await axios.post(
      "https://xnplfwb46ecpt6xezyxjieolp40vifvi.lambda-url.ap-south-1.on.aws/",
      { body: { url } },
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/537.36",
          Referer: "https://savetubeonline.com/",
          "Content-Type": "application/json",
        },
      }
    );

    const result = {
      title: response.data.title,
      duration: response.data.duration,
      thumbnail: response.data.thumbnail,
      view_count: response.data.view_count,
      video: response.data.formats
        .filter(
          (format) =>
            ["360p", "720p", "1080p", "1440p", "2160p"].includes(format.format_note) &&
            format.ext === "mp4"
        )
        .map((format) => ({
          format: format.format_note,
          url: format.url,
          filesize: format.filesize,
          aspect_ratio: format.aspect_ratio,
        })),
      audio: response.data.formats
        .filter((format) => format.ext === "m4a")
        .map((format) => ({
          url: format.url,
          filesize: format.filesize,
          audio_channels: format.audio_channels,
        })),
    };

    return result;
  } catch (error) {
    throw new Error("Error fetching YouTube details: " + error.message);
  }
}

module.exports = async (req, res) => {
  const url = req.query.url || "";
  const apiKey = req.query.apiKey;

  // Validasi input
  if (!url) {
    return res.status(400).json({
      error: "YouTube URL is required!",
    });
  }

  if (!apiKey || !allowedApiKeys.includes(apiKey)) {
    return res.status(403).json({
      error: "Invalid API key!",
    });
  }

  try {
    const result = await getYoutubeDetails(url);

    res.status(200).json({
      creator: "kaizel jskai",
      url: url,
      details: {
        title: result.title,
        duration: result.duration,
        thumbnail: result.thumbnail,
        view_count: result.view_count,
        video: result.video,
        audio: result.audio,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || "An error occurred while processing the request.",
    });
  }
};
