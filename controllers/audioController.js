const path = require('path');
const {
  uploadAudio,
  uploadBulkAudio,
  getAllAudios,
} = require('../models/audioModel');
const catchAsync = require('../utils/catchAsync');
const cloudinary = require('../utils/cloudinary');


// GET /api/audio
const getAudioList = catchAsync(async (req, res, next) => {
  try {
    const data = await getAllAudios();
    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// POST /api/audio/upload
const uploadAudioHandler = catchAsync(async (req, res, next) => {
  try {
    const { file } = req;

    if (!file) {
      return res.status(400).json({ message: 'File is required' });
    }

    const {name} = path.parse(file.originalname);
    const publicId = `sounds/${name}`;

    const result = await uploadAudio(file.buffer, publicId);

    res.status(201).json({
      publicId: result.public_id,
      url: result.secure_url,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// BULK upload
const bulkUploadAudioHandler = catchAsync(async (req, res, next) => {
  try {
    const { files } = req;

    if (!files || files.length === 0) {
      return res.status(400).json({
        message: 'No files uploaded',
      });
    }

    if (files.length > 200) {
      return res.status(400).json({
        message: 'Max 200 files allowed',
      });
    }

    const publicIds = files.map(file => {
      const {name} = path.parse(file.originalname);
      return `sounds/${name}`;
    });

    const results = await uploadBulkAudio(files, publicIds);

    res.status(201).json({
      total: files.length,
      uploaded: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = {
  getAudioList,
  uploadAudioHandler,
  bulkUploadAudioHandler,
};