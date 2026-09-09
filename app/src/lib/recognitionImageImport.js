// All imports are decoded and rasterized; no remote URLs or active SVG markup.
export async function readRecognitionFile(file, { sheet = false } = {}) {
  if (
    !["image/png", "image/jpeg", "image/webp"].includes(file.type) ||
    file.size > 12 * 1024 * 1024
  )
    throw new Error("Usa PNG, JPEG o WebP fino a 12 MB.");
  const url = URL.createObjectURL(file);
  const img = new Image();
  try {
    await new Promise((ok, fail) => {
      img.onload = ok;
      img.onerror = () => fail(new Error("Immagine non leggibile."));
      img.src = url;
    });
    if (img.naturalWidth * img.naturalHeight > 24000000)
      throw new Error("Immagine troppo grande: riducila sotto 24 megapixel.");
    if (sheet && Math.abs(img.naturalWidth / img.naturalHeight - 1.5) > 0.04)
      throw new Error(
        "La tavola deve avere proporzioni 3:2 e sei riquadri uguali (3 colonne × 2 righe).",
      );
    return Array.from({ length: sheet ? 6 : 1 }, (_, index) => {
      const sw = img.naturalWidth / (sheet ? 3 : 1),
        sh = img.naturalHeight / (sheet ? 2 : 1);
      const scale = Math.min(1, 1000 / Math.max(sw, sh));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(sw * scale));
      canvas.height = Math.max(1, Math.round(sh * scale));
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(
        img,
        (index % 3) * sw,
        Math.floor(index / 3) * sh,
        sw,
        sh,
        0,
        0,
        canvas.width,
        canvas.height,
      );
      for (const quality of [0.82, 0.7, 0.58]) {
        const encoded = canvas.toDataURL("image/webp", quality);
        if (!encoded.startsWith("data:image/webp;base64,")) {
          throw new Error(
            "Questo browser non supporta la conversione WebP. Aggiornalo e riprova.",
          );
        }
        if (encoded.length < 650000) return encoded;
      }
      throw new Error(
        "Immagine troppo complessa: riduci la risoluzione e riprova.",
      );
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function downloadRecognitionFile(name, contents, type) {
  const url = URL.createObjectURL(new Blob([contents], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
