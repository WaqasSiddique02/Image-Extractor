const express = require("express");
const multer = require("multer");
const tesseract = require("node-tesseract-ocr");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Set Tesseract path
process.env.TESSERACT_PATH = "D:\\Software\\tesseract\\tesseract.exe";
console.log("Tesseract Path:", process.env.TESSERACT_PATH);

// Tesseract configuration
const config = {
  lang: "eng",
  oem: 1,
  psm: 3
};

// Multer storage setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads/");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});

const upload = multer({ storage });

// 🔹 Upload image and process OCR
router.post("/upload", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  const imagePath = path.join(__dirname, "../uploads", req.file.filename);
  console.log("Processing Image Path:", imagePath);

  try {
    const text = await tesseract.recognize(imagePath, config);
    console.log("OCR Result:", text);
    res.json({ text });
  } catch (error) {
    console.error("OCR Error:", error.message);
    res.status(500).json({ error: "Error processing the image." });
  }
});

module.exports = router;
