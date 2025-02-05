const express = require("express");
const tesseract = require("node-tesseract-ocr");

const router = express.Router();

// Set Tesseract path early in the code
process.env.TESSERACT_PATH = "D:\\Software\\tesseract\\tesseract.exe";
console.log("Tesseract Path:", process.env.TESSERACT_PATH); // To verify if the path is set correctly
 
// Tesseract configuration
const config = {
  lang: "eng",
  oem: 1,
  psm: 3
};


// Route to fetch and convert the image
router.post("/", async (req, res) => {
  const imageUrl = `${req.body.imageUrl}`;

  console.log("Using Static Image Path:", imageUrl);

  try {
    const text = await tesseract.recognize(imageUrl, config);
    console.log("OCR Result:", text);
    res.send(text);
  } catch (error) {
    console.error("OCR Error:", error.message);
    res.status(500).send("Error processing the image.");
  }
});


// tesseract.recognize("D:\\Web-Dev\\New folder\\Image-Extractor\\public\\images\\englishpronouns.png", config)
//   .then(text => {
//     console.log("OCR Result:", text);
//   })
//   .catch(error => {
//     console.error("OCR Error:", error.message);
//   });

module.exports = router;