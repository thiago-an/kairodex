export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
res.setHeader("Access-Control-Allow-Headers", "Content-Type");

if (req.method === "OPTIONS") {
  return res.status(200).end();
}
  try {
    const { id } = req.query;

    const response = await fetch(`https://api.mangadex.org/manga/${id}`, {
      headers: {
        Accept: "application/json",
        "User-Agent": "KairoDEX/1.0"
      }
    });

    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}