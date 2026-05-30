export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        error: "ID do mangá não enviado."
      });
    }

    const response = await fetch(
      `https://api.mangadex.org/manga/${id}?includes[]=cover_art`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "KairoDEX/1.0"
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
}