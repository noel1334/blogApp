import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import axios from "axios";

dotenv.config();

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 1000,
};

// Function to upload to ImgBB (same as in postController and commentController)
const uploadToImgBB = async (fileBuffer, apiKey) => {
    try {
        const formData = new FormData();
        formData.append("image", new Blob([fileBuffer]));
        formData.append("key", apiKey);

        const response = await axios.post("https://api.imgbb.com/1/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        if (response.data.success) {
            return response.data.data.url;
        } else {
            console.error("ImgBB upload failed:", response.data);
            throw new Error("ImgBB upload failed");
        }
    } catch (error) {
        console.error("Error uploading to ImgBB:", error);
        throw error;
    }
};

export const validateToken = (req, res) => {
    const token = req.cookies.authToken; 
    if (!token) {
        return res.status(401).json({message: "Unauthorized"});
    }

    jwt.verify(token, process.env.JWT_SECRET, (err) => {
        if (err) {
            return res.status(403).json({message: "Token expired or invalid"});
        }
        res.status(200).json({message: "Token is valid"});
    });
};

export const register = async (req, res) => {
    const {name, email, password} = req.body;

    try {
        const user = await User.findByEmail(email);
        if (user) {
            return res.status(409).json('email address already exist');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const currentDate = new Date();
        await User.create(name, email, hashedPassword, currentDate);
        res.status(201).json('User registered successfully');
    } catch (error) {
        console.error(error);
        res.status(500).json('Error registering user');
    }
};

export const login = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.findByEmail(email);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json('Invalid credentials');
        }
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '2h'});
        const {password: _, ...userData} = user;
        res.cookie('authToken', token, cookieOptions)
            .status(200)
            .json(userData);
    } catch (error) {
        console.error(error);
        res.status(500).json('Error logging in');
    }

};

export const logout = (req, res) => {
    res.clearCookie('authToken');
    res.json('Logged out successfully');
};

export const updateUser = async (req, res) => {
    const userId = req.params.id;
    const {username, password} = req.body;
    let profileImage = null;  // Initialize to null
    const apiKey = process.env.IMGBB_API_KEY;

    if (!apiKey) {
        return res.status(500).json({message: "ImgBB API key not set in environment."});
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json("User not found");
        }

        // Upload new profile image if provided
        if (req.file) {
            profileImage = await uploadToImgBB(req.file.buffer, apiKey);
        }

        const hashedPassword = password ? await bcrypt.hash(password, 10) : user.password;
        await User.update(userId, username || user.username, profileImage || user.img, hashedPassword);
        const updatedUser = await User.findById(userId);
        res.json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json("Error updating user");
    }
};

export const getUserById = async (req, res) => {
    try {
        const {uid} = req.params;
        const sanitizedUid = uid.replace(':', '');
        const userWithPosts = await User.findUserById(sanitizedUid);

        if (!userWithPosts || userWithPosts.length === 0) {
            return res.status(404).json("User not found");
        }

        const userDetails = {
            id: userWithPosts[0].id,
            name: userWithPosts[0].username,
            email: userWithPosts[0].email,
            profileImg: userWithPosts[0].img,
            joinedDate: userWithPosts[0].date,
            posts: userWithPosts
                .filter((post) => post.postId)
                .map((post) => ({
                    id: post.postId,
                    title: post.title,
                    desc: post.desc,
                    img: post.postImg,
                    date: post.postDate,
                })),
        };

        res.status(200).json(userDetails);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json("Failed to fetch user");
    }
};

export const deleteUser = async (req, res) => {
    const userId = req.user.id;

    try {
        await User.delete(userId);
        res.clearCookie('authToken');
        res.json('User deleted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).json('Error deleting user');
    }
};