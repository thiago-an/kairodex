export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const { mangaId, fileName } = req.query;

    if (!mangaId || !fileName) {
      return res.status(400).send("Missing mangaId or fileName");
    }

    const imageUrl = `https://uploads.mangadex.org/covers/${mangaId}/${fileName}`;

    const response = await fetch(imageUrl);

    if (!response.ok) {
      return res.status(response.status).send("Image not found");
    }

    const buffer = await response.arrayBuffer();

    res.setHeader("Content-Type", response.headers.get("content-type") || "image/jpeg");
    res.setHeader("Cache-Control", "public, max-age=86400");

    res.status(200).send(Buffer.from(buffer));
  } catch (error) {
    res.status(500).send(error.message);
  }
}