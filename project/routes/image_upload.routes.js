import express from "express";

import {
  createImageUpload,
  getAllImageUploads,
  getImageUploadById,
  getImageUploadsByTrekId,
  getImageUploadsByUserId,
  updateImageUpload,
  deleteImageUpload,
} from "../controllers/image_upload.controller.js";

const router = express.Router();

// Create new upload record
router.post("/", createImageUpload);

// Read all image uploads
router.get("/", getAllImageUploads);

// Read image uploads by Trek ID
router.get("/trek/:trekId", getImageUploadsByTrekId);

// Read image uploads by User ID
router.get("/user/:userId", getImageUploadsByUserId);

// Read a single image upload by ID
router.get("/:id", getImageUploadById);

// Update an image upload
router.put("/:id", updateImageUpload);

// Delete an image upload
router.delete("/:id", deleteImageUpload);

export default router;
