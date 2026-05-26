export default async function handler(req, res) {
  try {
    const search = req.query.search || "";

    const params = new URLSearchParams();
    params.append("limit", "20");
    params.append("order[followedCount]", "desc");
    params.append("includes[]", "cover_art");

    if (search) {
      params.append("title", search);
    }

    const url = `https://api.mangadex.org/manga?${params.toString()}`;

    const response = await fetch(url, {
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