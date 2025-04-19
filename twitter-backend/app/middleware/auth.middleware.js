import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";

export const  protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer")) {
            return res.status(401).json({ message: "No token provided" });
        } 

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        if(!user) {
            console.log(" user not found in DB for ID:", decoded.id);
            return res.status(401).json({ message: "User not found" });
        } 
        req.user = user;
        next();
    } catch (err) {
        next(err);
    }
}