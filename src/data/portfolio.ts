export type PortfolioItem = {
  title: string;
  category: "Branding" | "UI/UX" | "Redes Sociales";
  behanceUrl: string;
  image: string;
};

// ─────────────────────────────────────────────────────────────────────────
// Portafolio. Behance no ofrece una API/RSS pública para sincronizar esto
// automáticamente, así que esta lista se actualiza a mano — pero es rápido:
// para agregar un proyecto nuevo, copia de su página en Behance:
//   1. El título
//   2. La categoría (Branding / UI/UX / Redes Sociales)
//   3. El enlace de la página del proyecto (behanceUrl)
//   4. La URL de la imagen de portada (click derecho → copiar dirección
//      de imagen sobre la miniatura del proyecto)
// y agrégalo como un nuevo objeto al inicio del arreglo. Al hacer commit y
// push, aparece automáticamente en /portafolio y en la home.
// ─────────────────────────────────────────────────────────────────────────

export const portfolioItems: PortfolioItem[] = [
  {
    title: "Traetelo.com E-commerce | UI/UX Case Study & App Design",
    category: "UI/UX",
    behanceUrl:
      "https://www.behance.net/gallery/255212537/Traetelocom-E-commerce-UIUX-Case-Study-App-Design",
    image:
      "https://mir-s3-cdn-cf.behance.net/projects/404/1860b7255212537.Y3JvcCwyODgwLDIyNTIsMCww.jpg",
  },
  {
    title: "Edición de video para formato corto (IG)",
    category: "Redes Sociales",
    behanceUrl:
      "https://www.behance.net/gallery/255115905/Edicion-de-video-para-formato-corto-(IG)",
    image:
      "https://mir-s3-cdn-cf.behance.net/projects/404/8c9730255115905.Y3JvcCw4MDgsNjMyLDAsMA.png",
  },
  {
    title: "Reels Día de las madres en Traetelo",
    category: "Redes Sociales",
    behanceUrl:
      "https://www.behance.net/gallery/250568579/Reels-Dia-de-las-madres-en-Traetelo",
    image:
      "https://mir-s3-cdn-cf.behance.net/projects/404/d8ab8d250568579.Y3JvcCw4MTMsNjM2LDU0LDA.png",
  },
  {
    title: "Traetelo E-Commerce",
    category: "UI/UX",
    behanceUrl: "https://www.behance.net/gallery/236273609/Traetelo-E-Commerce",
    image:
      "https://mir-s3-cdn-cf.behance.net/projects/404/3e016f236273609.Y3JvcCwxMTU1LDkwNCw0OTQsMC.jpg",
  },
  {
    title: "Cortefiel Venezuela",
    category: "Branding",
    behanceUrl: "https://www.behance.net/gallery/235611567/Cortefiel-Venezuela",
    image:
      "https://mir-s3-cdn-cf.behance.net/projects/404/7be294235611567.Y3JvcCwxMjc4LDEwMDAsMzE5LDA.jpg",
  },
  {
    title: "Branding MPH",
    category: "Branding",
    behanceUrl: "https://www.behance.net/gallery/235156441/BRANDING-MPH",
    image:
      "https://mir-s3-cdn-cf.behance.net/projects/404/6e24a8235156441.Y3JvcCwxMDgwLDg0NCwwLDExNw.png",
  },
  {
    title: "Miniso Venezuela",
    category: "Branding",
    behanceUrl: "https://www.behance.net/gallery/219140353/Miniso-Venezuela",
    image:
      "https://mir-s3-cdn-cf.behance.net/projects/404/1fb1a6219140353.Y3JvcCwxMjc4LDEwMDAsMzE5LDA.jpg",
  },
  {
    title: "Francesco Stangarone DJ/Productor",
    category: "Branding",
    behanceUrl:
      "https://www.behance.net/gallery/160596759/Francesco-Stangarone-DJProductor",
    image:
      "https://mir-s3-cdn-cf.behance.net/projects/404/6a6e92160596759.Y3JvcCwyMTMxLDE2NjcsMTg0LDA.png",
  },
  {
    title: "Royal King Barber",
    category: "Branding",
    behanceUrl: "https://www.behance.net/gallery/160594705/Royal-King-Barber",
    image:
      "https://mir-s3-cdn-cf.behance.net/projects/404/308348160594705.Y3JvcCwxMDgwLDg0NCwwLDExNw.jpg",
  },
  {
    title: "Urban Elements",
    category: "Branding",
    behanceUrl: "https://www.behance.net/gallery/160593707/Urban-Elements",
    image:
      "https://mir-s3-cdn-cf.behance.net/projects/404/b98f8e160593707.Y3JvcCwxMDgwLDg0NCwwLDExNw.png",
  },
  {
    title: "Proyecto RRSS Lumen To Go",
    category: "Redes Sociales",
    behanceUrl:
      "https://www.behance.net/gallery/160590799/Proyecto-RRSS-Lumen-To-Go",
    image:
      "https://mir-s3-cdn-cf.behance.net/projects/404/225109160590799.Y3JvcCwxMDgwLDg0NCwwLDExNw.png",
  },
  {
    title: "Hola Sushi Logo",
    category: "Branding",
    behanceUrl: "https://www.behance.net/gallery/137636759/Hola-Sushi-Logo",
    image:
      "https://mir-s3-cdn-cf.behance.net/projects/404/1593e5137636759.Y3JvcCwxNjMwLDEyNzUsMTIsMA.jpg",
  },
];
