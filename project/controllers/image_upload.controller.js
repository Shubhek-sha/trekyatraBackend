import prisma from '../config/prisma.js';

// 1. Create Image Upload
export const createImageUpload = async (req, res) => {
  try {
    const {trekId, images} = req.body;
    const userId = parseInt(req.user?.id || req.body.userId);

    if (!trekId || !userId) {
      return res.status(400).json({
        message: 'trekId and userId are required',
      });
    }

    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({
        message: 'An array of Cloudinary image URLs is required in the "images" field',
      });
    }

    const imageUpload = await prisma.imageUpload.create({
      data: {
        userId,
        trekId,
        images: images,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Image record created successfully',
      data: imageUpload,
    });
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

// 2. Get All Image Uploads
export const getAllImageUploads = async (req, res) => {
  try {
    const imageUploads = await prisma.imageUpload.findMany({
      include: {
        user: {select: {user_id: true, full_name: true, username: true}},
        trek: {select: {id: true, trekId: true, name: true}},
      },
      orderBy: {createdAt: 'desc'},
    });

    res.json({success: true, message: 'Image record fetched successfully', data: imageUploads});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

// 3. Get Image Upload By Id
export const getImageUploadById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const imageUpload = await prisma.imageUpload.findUnique({
      where: {imageId: id},
      include: {
        user: {select: {user_id: true, full_name: true, username: true}},
        trek: {select: {id: true, trekId: true, name: true}},
      },
    });

    if (!imageUpload) {
      return res.status(404).json({message: 'Image upload record not found'});
    }

    res.json({success: true, message: 'Image record fetched successfully', data: imageUpload});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

// 3.5. Get Image Uploads By Trek Id
export const getImageUploadsByTrekId = async (req, res) => {
  try {
    const {trekId} = req.params;

    const imageUploads = await prisma.imageUpload.findMany({
      where: {trekId: trekId},
      orderBy: {createdAt: 'desc'},
    });

    if (!imageUploads || imageUploads.length === 0) {
      return res.status(404).json({message: 'No image uploads found for this trek'});
    }

    res.json({success: true, message: 'Image record fetched successfully', data: imageUploads});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

// 3.6. Get Image Uploads By User Id
export const getImageUploadsByUserId = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    const imageUploads = await prisma.imageUpload.findMany({
      where: {userId: userId},
      orderBy: {createdAt: 'desc'},
    });

    if (!imageUploads || imageUploads.length === 0) {
      return res.status(404).json({message: 'No image uploads found for this user'});
    }

    res.json({success: true, message: 'Image record fetched successfully', data: imageUploads});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

// 4. Update Image Upload
// Typically, users might want to add more images, or remove some.
// For simplicity, we can overwrite the images array with new uploads if provided.
export const updateImageUpload = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const {images} = req.body;
    // const userId = req.user?.id || req.body.userId;

    const existingUpload = await prisma.imageUpload.findUnique({
      where: {imageId: id},
    });

    if (!existingUpload) {
      return res.status(404).json({message: 'Image upload record not found'});
    }

    let newImageUrls = existingUpload.images;

    // If new image array is provided, overwrite the old ones
    if (images && Array.isArray(images) && images.length > 0) {
      newImageUrls = images;
    }

    const updatedUpload = await prisma.imageUpload.update({
      where: {imageId: id},
      data: {
        images: newImageUrls,
      },
    });

    res.json({
      success: true,
      message: 'Image upload record updated successfully',
      data: updatedUpload,
    });
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

// 5. Delete Image Upload
export const deleteImageUpload = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const userId = req.user?.id || req.body.userId; // adjust based on your auth middleware

    const existingUpload = await prisma.imageUpload.findUnique({
      where: {imageId: id},
    });

    if (!existingUpload) {
      return res.status(404).json({message: 'Image upload record not found'});
    }

    // Optional Check: Only creator or admin can delete
    // if (existingUpload.userId !== userId) {
    //   return res.status(403).json({ message: 'Unauthorized' });
    // }

    await prisma.imageUpload.delete({
      where: {imageId: id},
    });

    res.json({success: true, message: 'Image upload record deleted successfully', data: []});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};
