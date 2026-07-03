import Tesseract from "tesseract.js";

const imagePath = "./uploads/test_ocr_page.png";

console.log("Running OCR on:", imagePath);

Tesseract.recognize(imagePath, "eng")
  .then(({ data: { text } }) => {
    console.log("\n OCR Extracted Text (first 400 chars):\n");
    console.log(text.slice(0, 400));
  })
  .catch(err => {
    console.error(" OCR failed:", err);
  });
