import { Request } from 'express';
import fs from 'fs';
import { StatusCodes } from 'http-status-codes';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import ApiError from '../errors/ApiError';

const videoUploadHandler = () => {
  const baseUploadDir = path.join(process.cwd(), 'uploads');
  const videoDir = path.join(baseUploadDir, 'videos');

  // Ensure the video directory exists
  if (!fs.existsSync(videoDir)) {
    fs.mkdirSync(videoDir, { recursive: true });
  }

  // Configure storage for video files
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, videoDir); // Store video files in the 'videos' folder
    },
    filename: (req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      const fileName =
        file.originalname
          .replace(fileExt, '')
          .toLowerCase()
          .split(' ')
          .join('-') +
        '-' +
        Date.now();
      cb(null, fileName + fileExt);
    },
  });

  // Define file filter for video files
  const fileFilter = (req: Request, file: any, cb: FileFilterCallback) => {
    if (file.mimetype === 'video/mp4' || file.mimetype === 'audio/mpeg') {
      cb(null, true);
    } else {
      cb(
        new ApiError(
          StatusCodes.BAD_REQUEST,
          'Only .mp4 and .mp3 files are supported'
        )
      );
    }
  };

  // Set up multer upload handler
  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
  }).fields([
    { name: 'media', maxCount: 3 }, // Allow multiple video files
  ]);

  return upload;
};

// Function to get the video file path
const getVideoFilePath = (files: any) => {
  if (files && files.media && files.media[0]) {
    return `/videos/${files.media[0].filename}`;
  }
  return null;
};

export { videoUploadHandler, getVideoFilePath };
