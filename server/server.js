const express = require("express");

const cors = require("cors");

const axios = require("axios");

const app = express();

app.use(cors());

app.get("/api/mangas", async(req,res)=>{

  try{

    const response = await axios.get(

      "https://api.mangadex.org/manga?limit=20&availableTranslatedLanguage[]=pt-br&order[followedCount]=desc"

    );

    res.json(response.data);

  }catch(error){

    res.status(500).json({
      error:error.message
    });

  }

});

app.get("/api/cover/:id", async(req,res)=>{

  try{

    const response = await axios.get(

      `https://api.mangadex.org/cover/${req.params.id}`

    );

    res.json(response.data);

  }catch(error){

    res.status(500).json({
      error:error.message
    });

  }

});

app.get("/api/chapters/:id", async(req,res)=>{

  try{

    const response = await axios.get(

      `https://api.mangadex.org/chapter?manga=${req.params.id}&limit=20`

    );

    res.json(response.data);

  }catch(error){

    res.status(500).json({
      error:error.message
    });

  }

});

app.get("/api/manga/:id", async(req,res)=>{

  try{

    const response = await axios.get(

      `https://api.mangadex.org/manga/${req.params.id}`

    );

    res.json(response.data);

  }catch(error){

    res.status(500).json({
      error:error.message
    });

  }

});

app.get("/", (req,res)=>{

  res.send("KairoDEX API ONLINE");

});

app.listen(3000, ()=>{

  console.log("Servidor rodando em http://localhost:3000");

});