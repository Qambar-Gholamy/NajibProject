const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 14 * 1024 * 1024, // 12MB per file
    files: 200, // max 200 files
  },
});

module.exports = { upload };