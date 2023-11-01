// your-script.js
document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = "/getNews"; // URL endpoint Express.js untuk mendapatkan data dari API
  const newsTable = document.getElementById("news-table");

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        const newsData = data.data; // Akses data dari properti 'data'

        for (let i = 0; i < newsData.length; i++) {
          const news = newsData[i];
          const row = document.createElement("tr");
          row.innerHTML = `
                  <td>${news.title}</td>
                  <td>${news.source}</td>
                  <td>${news.published_at}</td>
              `;
          newsTable.appendChild(row);
        }
      } else {
        console.error("Gagal mengambil data:", data.error);
      }
    })
    .catch((error) => {
      console.error("Terjadi kesalahan:", error);
    });
});
