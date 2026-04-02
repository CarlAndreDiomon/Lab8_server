import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const protect = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ error: "Invalid or expired token" });
        }
    } else {
        res.status(401).json({
            error: "No token provided.",
            message: "Login now!" });
    }
};

export default protect;