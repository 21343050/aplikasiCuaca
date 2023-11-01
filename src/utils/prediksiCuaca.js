const { response } = require("express");
const request = require("postman-request");

const forecast = (latitude, longitude, callback) => {
  const url = "http://api.weatherstack.com/current?access_key=60c286066bc4003b329dbcc4f9b83e1c&query=" + encodeURIComponent(latitude) + "," + encodeURIComponent(longitude) + "&units=m";

  request({ url: url, json: true }, (error, response) => {
    if (error) {
      callback("Tidak dapat terkoneksi ke layanan", undefined);
    } else if (response.body.error) {
      callback("tidak dapat menemukan lokasi", undefined);
    } else {
      callback(
        undefined,
        "Info Cuaca: " +
          response.body.current.weather_descriptions[0] +
          ". " +
          "Suhu saat ini adalah " +
          response.body.current.temperature +
          " derajat. " +
          "Index UV adalah " +
          response.body.current.uv_index +
          " nm. " +
          "Visibilitas " +
          response.body.current.visibility +
          " kilometer"
      );
    }
  });
};
module.exports = forecast;
