import bcrypt from 'bcryptjs';
import {user} from '../models/userModel.js';
import {generateToken} from '../utils/auth.js';
import z from "zod"

const registerationSchema = z.object({
    username: z.string().min(3).max(30),
    email: z.string().email(),
    password: z.string().min(6)
});

export const createUser = async (req, res) => {
    try {
        const {username, email, password} = registerationSchema.parse(req.body);
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await user.create({username, email, password: hashedPassword});
        const token = generateToken(newUser._id);
        res.status(201).json({token});
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
}

export const updateUser = async (req, res) => {
    try {
        const userId = req.user.userId;
        const {username, email, password} = registerationSchema.parse(req.body);
        const hashedPassword = await bcrypt.hash(password, 10);
        await user.findByIdAndUpdate(userId, {username, email, password: hashedPassword});
        res.status(200).json({
            message: "User updated successfully"
        })
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

export const getUser = async (req, res) => {
    try {
        const userId = req.user.userId;
        const result = await user.findById(userId);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({error: error.message});
    }

}

export const readUser = async (req, res) => {
    try {
        const {page, limit, sort} = req.query;
        const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
        const skip = (page - 1) * limit;
        const users = await user.find()
        .sort({ [sort]: sortOrder})
        .skip(skip)
        .limit(parseInt(limit));
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

export const deleteUser = async (req, res) => {
    try {
        const userId = req.user.userId;
        await user.findByIdAndDelete(userId);
        res.status(200).json({
            message: "User deleted successfully"
        });
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}