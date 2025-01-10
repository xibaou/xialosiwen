const axios = require("axios");
const allowedApiKeys = require("../../declaration/arrayKey.jsx"); // Import API keys

async function text2promptWithRetry(text, retries = 3, delay = 3000) {
  if (!text) return { status: false, message: "Undefined reading text" };

  const url = "https://api-v1.junia.ai/api/free-tools/generate";
  const payload = {
    content: text,
    op: "op-prompt",
  };

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await axios.post(url, payload);

      if (response?.data) {
        let prompt = response.data;

        if (prompt.length <= 2) throw new Error("Failed generating prompt");

        prompt = prompt.replace(`"`, ``);
        return {
          status: true,
          prompt,
        };
      }

      throw new Error("Invalid response format");
    } catch (error) {
      if (error.response?.status === 429) {
        const retryAfter = parseInt(error.response.headers["retry-after"]) || delay / 1000;
        await wait(retryAfter * 1000);
      } else {
        return { status: false, message: error.message };
      }
    }
  }

  return { status: false, message: "Failed after maximum retries." };
}

module.exports = async (req, res) => {
  const text = req.query.text || '';
  const apiKey = req.query.apiKey;

  if (!text) {
    return res.status(400).json({
      error: 'Text is required!',
    });
  }

  if (!apiKey || !allowedApiKeys.includes(apiKey)) {
    return res.status(403).json({
      error: 'Invalid API key!',
    });
  }

  try {
    const promptResponse = await text2promptWithRetry(text);
    if (!promptResponse.status) {
      return res.status(500).json({
        error: promptResponse.message || 'Failed to generate prompt.',
      });
    }

    res.status(200).json({
      creator: 'kaizel jskai',
      text: text,
      generated_prompt: promptResponse.prompt,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || 'An error occurred while generating the prompt.',
    });
  }
};
