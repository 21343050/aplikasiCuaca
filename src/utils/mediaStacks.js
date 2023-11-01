const axios = require("axios");

const apiKey = "3b7b5c1dee44a5387085a13a1b003a76";

const limit = 5;

async function getNews() {
  try {
    const response = await axios.get(`http://api.mediastack.com/v1/news?access_key=${apiKey}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw new Error("Terjadi kesalahan saat mengambil data dari Media Stack");
  }
}

module.exports = {
  getNews,
};
