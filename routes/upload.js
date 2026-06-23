import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

const BASE_DIR = "src/assets/img/product";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempDir = path.join(BASE_DIR, "temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + file.originalname;
    cb(null, unique);
  },
});

const upload = multer({ storage });

router.post("/", upload.array("image", 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(200).json({ imagePaths: [] });
  }

  // Create a unique folder name for this product
  const folderName = Date.now().toString(); 
  const productFolder = path.join(BASE_DIR, folderName);
  if (!fs.existsSync(productFolder)) fs.mkdirSync(productFolder, { recursive: true });

  const imagePaths = [];

  req.files.forEach((file) => {
    const newPath = path.join(productFolder, file.filename);
    fs.renameSync(file.path, newPath);

    // Path that frontend can use to show image
    imagePaths.push(`src/assets/img/product/${folderName}/${file.filename}`);
  });

  res.json({ imagePaths });
});

export default router;
