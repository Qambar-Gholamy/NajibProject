const express = require('express');
const {
  getAudioList,
  uploadAudioHandler,
   bulkUploadAudioHandler,
} = require('../controllers/audioController');

const { upload } = require('../utils/uploadMiddleware');

const router = express.Router();

// GET all audios
// http://localhost:3000/api/audio
router.get('/', getAudioList);

// Upload audio
// http://localhost:3000/api/audio/upload
router.post('/upload', upload.single('file'), uploadAudioHandler);
router.post(
  '/bulk-upload',
  upload.array('files', 200),
  bulkUploadAudioHandler
);

module.exports = router;