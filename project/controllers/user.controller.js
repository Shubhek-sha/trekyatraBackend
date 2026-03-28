import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import prisma from '../config/prisma.js';
import {generateOTP} from '../utils/otp.js';

dotenv.config();

// export const generateOTP = () => {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// };

export const registerUser = async (req, res) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {email: req.body.email},
    });

    //check if the user is verified or not if not allow annother user with same email to do register
    if (existingUser) {
      return res.status(400).json({message: 'Email already registered'});
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // const otpGenerated = generateOTP();
    const otpGenerated = '123456';
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        email: req.body.email,
        password_hash: hashedPassword,
        full_name: req.body.full_name,
        username: req.body.full_name + Math.floor(1000 + Math.random() * 9000),
        phone: req.body.phone,
        otp: otpGenerated,
        otp_expires: otpExpires,
      },
    });

    res.status(201).json({
      message: 'User registered. OTP sent to email.',
      user: user,
    });
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

// RESEND OTP
export const resendOTP = async (req, res) => {
  const {email} = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {email},
    });

    if (!user) return res.status(404).json({message: 'User not found'});

    const otpGenerated = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: {email},
      data: {otp: otpGenerated, otp_expires: otpExpires},
    });

    res.json({message: 'OTP resent successfully.'});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

// VERIFY OTP
export const verifyOTP = async (req, res) => {
  const {email, otpCode} = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {email},
    });

    if (!user) return res.status(404).json({message: 'User not found'});

    if (user.otp !== otpCode) {
      return res.status(400).json({message: 'Invalid OTP'});
    }

    if (new Date() > new Date(user.otp_expires)) {
      return res.status(400).json({message: 'OTP expired'});
    }

    // Clear OTP
    await prisma.user.update({
      where: {email},
      data: {otp: null, otp_expires: null, isVerified: true},
    });

    const token = jwt.sign({id: user.user_id}, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    //remove sensetive info
    const {password_hash, otp, otp_expires, ...userWithoutSensitive} = user;

    res.json({message: 'OTP verified successfully. Account activated.', user: userWithoutSensitive, token: token});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  const {email, password} = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {email},
    });

    if (!user) return res.status(404).json({message: 'User not found'});

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({message: 'Invalid password'});

    const token = jwt.sign({id: user.user_id}, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    //remove sensetive info
    const {password_hash, otp, otp_expires, ...userWithoutSensitive} = user;

    res.json({token: token, user: userWithoutSensitive});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        user_id: true,
        email: true,
        full_name: true,
        username: true,
        profile_picture: true,
        phone: true,
        date_of_birth: true,
        fitness_level: true,
        preferred_difficulty: true,
        preferred_max_duration: true,
        location_country: true,
        location_city: true,
        bio: true,
        isVerified: true,
        otp: true,
      },
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

// PROFILE
export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {user_id: req.user.id},
      select: {
        user_id: true,
        email: true,
        full_name: true,
        username: true,
        profile_picture: true,
        phone: true,
        date_of_birth: true,
        fitness_level: true,
        preferred_difficulty: true,
        preferred_max_duration: true,
        location_country: true,
        location_city: true,
        bio: true,
      },
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

//update password
export const updatePassword = async (req, res) => {
  const {email, password} = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {email},
    });

    if (!user) return res.status(404).json({message: 'User not found'});

    const newPassword = await bcrypt.hash(password, 10);

    // Clear OTP
    await prisma.user.update({
      where: {email},
      data: {password_hash: newPassword},
    });
    res.json({message: 'Password updated successfully.'});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};
