const cloudinary = require('../utils/cloudinary');

const uploadAudio = (buffer, publicId) => 
 new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'video',
        public_id: publicId,
        overwrite: true,
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
       url: cloudinary.url(r.public_id, {
          resource_type: 'video',
          secure: true,
      }),
    }));
};

// bulk upload
const uploadBulkAudio = async (files, startIndex = 1) => {
  const results = [];

  // ⚠️ sequential to avoid rate limit
    // eslint-disable-unary-operator
  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];
    const index = startIndex + i;

    const publicId = `sounds/audio_${String(index).padStart(2, '0')}`;

    try {
        // eslint-disable-next-line no-await-in-loop
      const res = await uploadAudio(file.buffer, publicId);

      results.push({
        success: true,
        index,
        publicId: res.public_id,
        url: cloudinary.url(res.public_id, {
        resource_type: 'video',
        secure: true,
         }),
      });

    } catch (error) {
      results.push({
        success: false,
        index,
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