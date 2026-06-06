import prisma from '../config/prisma.js';
import fs from 'fs';

// Upload Multiple Images
export const uploadMultipleTrekImages = async (req, res) => {
  try {
    const trek_id = parseInt(req.body.trek_id);
    const user_id = parseInt(req.user?.id || req.body.user_id);

    if (!trek_id || !user_id) {
      return res.status(400).json({
        message: 'trek_id and user_id are required',
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: 'No files uploaded',
      });
    }

    const data = req.files.map((file, index) => ({
      user_id,
      trek_id,
      url: `/uploads/${file.filename}`,
      caption: `Image ${index + 1}`,
      is_cover: index === 0 ? 1 : 0,
      sort_order: index + 1,
    }));

    await prisma.trekImage.createMany({
      data,
    });

    res.json({
      message: 'Images uploaded successfully',
      files: req.files.map((f) => f.filename),
    });
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

// Delete image
export const deleteImage = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const user_id = req.user.id;

    const image = await prisma.trekImage.findUnique({
      where: {image_id: id},
    });

    if (!image) {
      return res.status(404).json({message: 'Not found'});
    }

    if (image.user_id !== user_id) {
      return res.status(403).json({
        message: 'Unauthorized',
      });
    }

    const filePath = '.' + image.url;
    fs.unlink(filePath, () => {});

    await prisma.trekImage.delete({
      where: {image_id: id},
    });

    res.json({message: 'Deleted successfully'});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};
