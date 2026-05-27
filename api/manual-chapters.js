export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const { mangaId } = req.query;

  const manualDatabase = {
    "32d76d19-8a05-4db0-9fc2-e0b0648fe9d0": [
      {
        id: "manual-capitulo-1",
        title: "Capítulo 1",
        number: "1",
        source: "manual"
      }
    ]
  };

  res.status(200).json({
    result: "ok",
    data: manualDatabase[mangaId] || []
  });
}