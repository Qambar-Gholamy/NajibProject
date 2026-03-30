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
    const { index } = req.body;

    if (!file) {
      return res.status(400).json({ message: 'File is required' });
    }

    if (!index) {
      return res.status(400).json({ message: 'Index is required' });
    }

    const result = await uploadAudio(file.buffer, index);

    res.status(201).json({
      success: true,
      publicId: result.public_id,
      url: cloudinary.url(result.public_id, {
      resource_type: 'video',
      secure: true,
      }),
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
    const { startIndex = 1 } = req.body;

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

    const results = await uploadBulkAudio(files, Number(startIndex));

    res.status(201).json({
      success: true,
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