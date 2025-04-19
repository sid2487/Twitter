import bcrypt from "bcryptjs";
import { User } from "../model/user.model.js";
import { generateToken } from "../utils/generateToken.js";

export const register = async (req, res) => {
    try {
        const { username, password } = req.body;

        const userExist = await User.findOne({ username });
        if (userExist) return res.status(400).json({ message: "User already exist" });

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashed });

        res.status(201).json({
            token: generateToken(user._id),
            username: user.username,
        });
    } catch (err) {
        next(err);
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                message: "Login Successful",
                token: generateToken(user._id),
                username: user.username,
                id: user._id
            });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (err) {
        next(err);
    }
}