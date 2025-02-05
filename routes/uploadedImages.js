const express = require("express");
const router = express.Router();
const sql = require("mssql");

// GET all uploaded images
router.get("/", async (req, res) => {
  try {
    const result = await sql.query(`
            SELECT UploadedImages.*, Users.name AS user_name 
            FROM UploadedImages
            LEFT JOIN Users ON UploadedImages.user_id = Users.id
        `);
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching uploaded images:", error);
    res.status(500).json({ message: "Error fetching uploaded images", error });
  }
});

// POST a new uploaded image
router.post("/", async function (req, res) {
  var user_id = req.body.user_id;
  var image_path = req.body.image_path;
  var extracted_text = req.body.extracted_text;
  var language = req.body.language;
  try {
    // Insert the data into the UploadedImages table
    const query = `
            INSERT INTO UploadedImages (user_id, image_path, extracted_text, language) 
            VALUES (${user_id}, '${image_path}', '${extracted_text}', '${language}');
        `;
    await sql.query(query);

    // Send a success response
    res.send("Image uploaded successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Failed to upload image");
  }
});

module.exports = router;
