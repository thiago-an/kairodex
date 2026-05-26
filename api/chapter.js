export default async function handler(req, res) {
  try {
    const { id } = req.query;

    const response = await fetch(`https://api.mangadex.org/at-home/server/${id}`, {
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