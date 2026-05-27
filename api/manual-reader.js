export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const { id } = req.query;

  const manualPages = {
    "manual-capitulo-1": [
      "/assets/chapters/exemplo/1.jpg",
      "/assets/chapters/exemplo/2.jpg",
      "/assets/chapters/exemplo/3.jpg"
    ]
  };

  res.status(200).json({
    result: "ok",
    source: "manual",
    pages: manualPages[id] || []
  });
}