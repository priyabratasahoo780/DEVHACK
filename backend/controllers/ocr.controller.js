import * as ocrService from '../services/ocr.service.js';
import fs from 'fs';

/**
 * Handle Soil Report Upload and OCR Scanning
 */
export const scanReport = async (req, res) => {
  try {
    // The file is attached to req.file by uploadMiddleware
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image or PDF file provided'
      });
    }

    const filePath = req.file.path;

    // Process the file through the OCR service
    const extractedData = await ocrService.scanSoilReport(filePath);

    // Optional: Clean up the uploaded file after processing to save disk space
    // fs.unlink(filePath, (err) => {
    //   if (err) console.error('Failed to delete temporary file:', err);
    // });

    return res.status(200).json({
      success: true,
      message: 'Document scanned successfully',
      data: extractedData
    });

  } catch (error) {
    console.error('OCR Controller Error:', error);
    
    // Ensure we clean up on error as well
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, () => {});
    }

    return res.status(500).json({
      success: false,
      message: error.message || 'An error occurred during document scanning'
    });
  }
};
