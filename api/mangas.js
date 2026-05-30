export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const search = req.query.search || "";

    const params = new URLSearchParams();

    params.append("limit", "30");
    params.append("includes[]", "cover_art");
    params.append("availableTranslatedLanguage[]", "pt-br");
    params.append("order[followedCount]", "desc");

    params.append("contentRating[]", "safe");
    params.append("contentRating[]", "suggestive");

    if (search) {
      params.append("title", search);
    }

    const response = await fetch(
      `https://api.mangadex.org/manga?${params.toString()}`
    );

    const data = await response.json();

    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}