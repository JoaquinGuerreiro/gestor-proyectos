// backend/middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Usar la ruta raíz del proyecto
const uploadsDir = path.join(__dirname, '..', 'uploads');

// Asegurarse de que el directorio existe
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('Saving file to:', uploadsDir);
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    console.log('Generated filename:', `${uniqueSuffix}${ext}`);
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

const upload = multer({ storage: storage });
module.exports = upload;