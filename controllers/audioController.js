const path = require('path');
const {
  uploadAudio,
  uploadBulkAudio,
  getAllAudios,
} = require('../models/audioModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// GET /api/audio
const getAudioList = catchAsync(async (req, res, next) => {
  const { cursor, limit, prefix } = req.query;
  const limitNum = Number(limit);
  
  // Input validation
  if (limit && (Number.isNaN(limitNum) || limitNum < 1 || limitNum > 500)) {
    return next(new AppError('Limit must be a number between 1 and 500', 400));
  }
  if (prefix && typeof prefix !== 'string') {
    return next(new AppError('Prefix must be a string', 400));
  }

  const data = await getAllAudios({ 
    cursor: cursor || null, 
    limit: limitNum || 100, 
    prefix: prefix || 'sounds/' 
  });

  res.status(200).json({
    success: true,
    data,
  });
});

// POST /api/audio/upload
const uploadAudioHandler = catchAsync(async (req, res, next) => {
  const { file } = req;

  if (!file) {
    return next(new AppError('File is required', 400));
  }

  const { name } = path.parse(file.originalname);
  const publicId = `sounds/${name}`;

  const result = await uploadAudio(file.buffer, publicId);

  res.status(201).json({
    publicId: result.public_id,
    url: result.secure_url,
  });
});

// BULK upload
const bulkUploadAudioHandler = catchAsync(async (req, res, next) => {
  const { files } = req;

  if (!files || files.length === 0) {
    return next(new AppError('No files uploaded', 400));
  }

  if (files.length > 200) {
    return next(new AppError('Max 200 files allowed', 400));
  }

  const publicIds = files.map(file => {
    const { name } = path.parse(file.originalname);
    return `sounds/${name}`;
  });

  const results = await uploadBulkAudio(files, publicIds);

  res.status(201).json({
    total: files.length,
    uploaded: results.filter(r => r.publicId).length,
    failed: results.filter(r => r.error).length,
    results,
  });
});

module.exports = {
  getAudioList,
  uploadAudioHandler,
  bulkUploadAudioHandler,
};

