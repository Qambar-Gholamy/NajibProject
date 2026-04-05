const cloudinary = require('../utils/cloudinary');

const uploadAudio = (buffer, publicId) => 
 new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'video',
        public_id: publicId,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(buffer);
  });
const getAllAudios = async () => {
  const result = await cloudinary.api.resources({
    resource_type: 'video',
    type: 'upload',
    max_results: 2000,
  });

  return result.resources
    .sort((a, b) => a.public_id.localeCompare(b.public_id))
    .map((r, i) => ({
      id: `audio_${String(i + 1).padStart(2, '0')}`,
      publicId: r.public_id,
      url: r.secure_url,
    }));
};

// bulk upload
const uploadBulkAudio = async (files, publicIds) => {
  const results = [];

  // ⚠️ sequential to avoid rate limit
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const publicId = publicIds[i];

    try {
      // eslint-disable-next-line no-await-in-loop
      const res = await uploadAudio(file.buffer, publicId);

      results.push({
        success: true,
        index: i + 1,
        publicId: res.public_id,
        unique_filename: true,
        overwrite: false,
        url: res.secure_url,
      });
    } catch (error) {
      results.push({
        success: false,
        index: i + 1,
        error: error.message,
      });
    }
  }

  return results;
};

module.exports = {
  uploadAudio,
  uploadBulkAudio,
  getAllAudios
};