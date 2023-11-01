const express = require("express");
const path = require("path");
const req = require("express/lib/request");
const res = require("express/lib/response");
const hbs = require("hbs");
const geocode = require("./utils/geoCode");
const mediastack = require("./utils/mediaStacks");
const { error } = require("console");
const forecast = require("./utils/prediksiCuaca");
const getBerita = require("axios");
const axios = require("axios");

const app = express();
const direktoriPublic = path.join(__dirname, "../public");
const direktoriViews = path.join(__dirname, "../templates/views");
const direktoriPartials = path.join(__dirname, "../templates/partials");

app.set("view engine", "hbs");
app.set("views", direktoriViews);
hbs.registerPartials(direktoriPartials);

app.use(express.static(direktoriPublic));

app.get("/berita", async (req, res) => {
  try {
    const urlApiMediaStack = "http://api.mediastack.com/v1/news";
    const apiKey = "3b7b5c1dee44a5387085a13a1b003a76";
    const limit = 2;

    const params = {
      access_key: apiKey,
      countries: "id",
    };

    const response = await axios.get(`http://api.mediastack.com/v1/news?access_key=${apiKey}&limit=${limit}`, { params });
    const dataBerita = response.data;

    res.render("berita", {
      nama: "Heri Ramadhan",
      judul: "Laman Berita",
      berita: dataBerita.data,
    });
  } catch (error) {
    console.error(error);
    res.render("error", {
      judul: "Terjadi Kesalahan",
      pesanKesalahan: "Terjadi kesalahan saat mengambil berita.",
    });
  }
});

app.get("/getNews", async (req, res) => {
  try {
    const newsData = await mediastack.getNews();
    res.json({ success: true, data: newsData });
  } catch (error) {
    console.error(error); // Log error untuk pemantauan server
    res.status(500).json({ success: false, error: "Terjadi kesalahan saat mengambil data dari Media Stack. Silakan coba lagi nanti." });
  }
});

//halaman page utama
app.get("", (req, res) => {
  res.render("", {
    judul: "Aplikasi Cek Cuaca",
    nama: "Heri Ramadhan",
  });
});

//halaman bantuan/FAQ
app.get("/bantuan", (req, res) => {
  res.render("bantuan", {
    judul: "bantuan",
    teksBantuan: "ini adalah teks bantuan.",
    nama: "Heri Ramadhan",
  });
});

//halaman infoCuaca
app.get("/infocuaca", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "Kamu harus memasukan lokasi yang ingin dicari",
    });
  }
  geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return res.send({ error });
    }
    forecast(latitude, longitude, (error, dataPrediksi) => {
      if (error) {
        return res.send({ error });
      }
      res.send({
        prediksiCuaca: dataPrediksi,
        lokasi: location,
        address: req.query.address,
      });
    });
  });
});

//halaman tentang
app.get("/tentang", (req, res) => {
  res.render("tentang", {
    judul: "Tentang Saya",
    nama: "Heri Ramadhan",
  });
});

//halaman berita
// app.get("/berita", (req, res) => {
//   res.render("berita", {
//     judul: "Berita",
//     nama: "Heri Ramadhan",
//     Berita: "Berita Hari Ini",
//   });
// });

app.get("/*", (req, res) => {
  res.render("404", {
    judul: "404",
    nama: "Heri Ramadhan",
    pesanKesalahan: "Artikel yang dicari tidak ditemukan.",
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    judul: "404",
    nama: "Heri Ramadhan",
    pesanKesalahan: "Halaman tidak ditemukan",
  });
});

app.listen(4000, () => {
  console.log("Server berjalan pada port 4000");
});
