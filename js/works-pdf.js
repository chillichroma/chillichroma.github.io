import * as pdfjsLib from "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.min.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs";

const files = [
  "Chilli_Chroma2026-9-HP1.pdf",
  "Chilli_Chroma2026-9-HP2.pdf"
];

const container = document.getElementById("portfolio-pages");

async function renderPdf(file) {
  const pdf = await pdfjsLib.getDocument({
    url: file,
    disableFontFace: false,
    useSystemFonts: true
  }).promise;

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber);
    const baseViewport = page.getViewport({ scale: 1 });
    const targetWidth = Math.min(window.innerWidth, 1800);
    const scale = targetWidth / baseViewport.width;
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { alpha: false });

    const outputScale = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(viewport.width * outputScale);
    canvas.height = Math.floor(viewport.height * outputScale);
    canvas.style.width = "100%";
    canvas.style.height = "auto";
    canvas.className = "portfolio-page";

    const transform = outputScale !== 1
      ? [outputScale, 0, 0, outputScale, 0, 0]
      : null;

    await page.render({
      canvasContext: ctx,
      viewport,
      transform,
      intent: "display",
      background: "rgb(255,255,255)"
    }).promise;

    container.appendChild(canvas);
    page.cleanup();
  }
}

async function init() {
  const loading = document.createElement("div");
  loading.className = "portfolio-loading";
  loading.textContent = "포트폴리오를 불러오는 중입니다.";
  container.appendChild(loading);

  try {
    for (const file of files) {
      await renderPdf(file);
    }
    loading.remove();
  } catch (error) {
    console.error(error);
    loading.className = "portfolio-error";
    loading.textContent = "포트폴리오를 불러오지 못했습니다.";
  }
}

init();
