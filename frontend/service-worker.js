self.addEventListener("install", () => {
  console.log("KairoDEX Service Worker instalado");
});

self.addEventListener("activate", () => {
  console.log("KairoDEX Service Worker ativo");
});