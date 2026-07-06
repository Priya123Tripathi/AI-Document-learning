import fs from "fs";
import path from "path";
import Tesseract from "tesseract.js";
import { fromPath } from "pdf2pic";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

export async function extractText(filePath, uploadDir) {
  try {
    console.log(" Checking file existence at:", filePath);
    if (!fs.existsSync(filePath)) {
      throw new Error("File not found at path: " + filePath);
    }

    // Try pdf-parse (Digital Text)
    const dataBuffer = fs.readFileSync(filePath);
    const result = await pdfParse(dataBuffer);

    if (result && result.text && result.text.trim().length > 50) {
      console.log(" Digital text found via pdf-parse");
      return { text: result.text.trim(), method: "pdf-parse" };
    }

    //  OCR Mode (Scanned PDF)
    console.log(" Scanned PDF detected. Starting OCR...");

    const options = {
      density: 300,
      saveFilename: `ocr_${Date.now()}`,
      savePath: uploadDir,
      format: "png",
      width: 1600,
      height: 2000,
    };

    const convert = fromPath(filePath, options);
    const storeAsImage = await convert(1);

    const actualImagePath = storeAsImage.path || path.join(uploadDir, `${options.saveFilename}.1.png`);

    console.log("OCR Image Path:", actualImagePath);

    if (!fs.existsSync(actualImagePath)) {
      throw new Error("Image conversion failed - file not found.");
    }

    const { data: { text } } = await Tesseract.recognize(actualImagePath, "eng+hin");

    if (fs.existsSync(actualImagePath)) fs.unlinkSync(actualImagePath);

    if (!text || text.trim().length === 0) {
      return { text: "No text could be read from this image/PDF.", method: "OCR-Empty" };
    }

    console.log("OCR extraction successful");
    return { text: text.trim(), method: "OCR" };

  } catch (err) {
    console.error(" Extraction Process Failed:", err.message);
    return { text: "Error extracting text: " + err.message, method: "error" };
  }
}