export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
res.setHeader("Access-Control-Allow-Headers", "Content-Type");

if (req.method === "OPTIONS") {
  return res.status(200).end();
}
  try {
    const { id } = req.query;

    const params = new URLSearchParams();
    params.append("manga", id);
    params.append("limit", "100");
    params.append("translatedLanguage[]", "pt-br");
    params.append("translatedLanguage[]", "en");
    params.append("order[chapter]", "desc");

    const response = await fetch(`https://api.mangadex.org/chapter?${params.toString()}`, {
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