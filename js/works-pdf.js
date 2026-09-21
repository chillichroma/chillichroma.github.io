import * as pdfjsLib from "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.min.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs";

const files = [
  "Chilli_Chroma2026-9-HP1.pdf",
  "Chilli_Chroma2026-9-HP2.pdf"
];

const container = document.getElementById("portfolio-pages");

async function renderPdf(file) {
  const pdf = await pdfjsLib.getDocument(file).promise;

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber);
    const baseViewport = page.getViewport({ scale: 1 });

    // 화면 폭에 맞추되 과도한 메모리 사용은 막음.
    const targetWidth = Math.min(window.innerWidth, 1800);
    const scale = targetWidth / baseViewport.width;
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { alpha: false });

    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);

    await page.render({
      canvasContext: context,
      viewport,
      background: "rgb(255,255,255)"
    }).promise;

    // 브라우저 PDF 뷰어 대신 페이지 자체만 이미지로 표시.
    const blob = await new Promise(resolve =>
      canvas.toBlob(resolve, "image/jpeg", 0.94)
    );

    const img = document.createElement("img");
    img.className = "portfolio-page";
    img.alt = "";
    img.loading = "lazy";
    img.decoding = "async";
    img.src = URL.createObjectURL(blob);

    container.appendChild(img);

    // canvas 메모리 즉시 해제
    canvas.width = 1;
    canvas.height = 1;
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
