const express = require("express");

const cors = require("cors");

const axios = require("axios");

const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

/**
 * FRONTEND
 */

app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/pages/login.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/pages/dashboard.html"));
});

app.get("/manga", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/pages/manga.html"));
});

app.get("/chapter", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/pages/chapter.html"));
});

app.get("/library", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/pages/library.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/pages/admin.html"));
});

/**
 * API MANGADEX
 */

/**
 * LISTAR MANGÁS
 */

app.get("/api/mangas", async (req, res) => {
  try {
    const search = req.query.search || "";

    const params = new URLSearchParams();

    params.append("limit", "20");
    params.append("order[followedCount]", "desc");
    params.append("includes[]", "cover_art");

    if (search) {
      params.append("title", search);
    }

    const mangadexUrl = `https://api.mangadex.org/manga?${params.toString()}`;

    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(mangadexUrl)}`;

    const response = await fetch(proxyUrl);
    const data = await response.json();

    res.json(data);

  } catch (error) {
    console.log("Erro MangaDex:", error.message);

    res.status(500).json({
      error: error.message
    });
  }
});

/**
 * DETALHES MANGÁ
 */

app.get("/api/manga/:id", async (req, res) => {

  try {

    const response = await axios.get(

      `https://api.mangadex.org/manga/${req.params.id}`

    );

    res.json(response.data);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});

/**
 * CAPA
 */

app.get("/api/cover/:id", async (req, res) => {

  try {

    const response = await axios.get(

      `https://api.mangadex.org/cover/${req.params.id}`

    );

    res.json(response.data);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});

/**
 * CAPÍTULOS
 */

app.get("/api/chapters/:id", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.mangadex.org/chapter?manga=${req.params.id}&limit=100&translatedLanguage[]=pt-br&translatedLanguage[]=en&order[chapter]=desc`
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

/**
 * LEITOR
 */

app.get("/api/chapter/:id", async (req, res) => {

  try {

    const response = await axios.get(

      `https://api.mangadex.org/at-home/server/${req.params.id}`

    );

    res.json(response.data);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

});

/**
 * START
 */

app.listen(PORT, () => {

  console.log(`🔥 KairoDEX Server rodando na porta ${PORT}`);

});