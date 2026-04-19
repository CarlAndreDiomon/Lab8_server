import { User } from "../model/userModel.js";
import bcrypt from 'bcryptjs';
import { generateToken } from "../lib/utils.js";


export const registerUser = async (req, res) => {
    const { name, email, role, password } = req.body;

    try {
        if (
            !name ||
            !email ||
            !role ||
            !password
        ) {
            return res.status(400).json({ error: "Complete All Fields." });
        };

        if (password.length < 7) {
            return res.status(400).json({error: "Password should be at least 7 characters."});
        };

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({error: "Invalid email format." });
        };

        let user = await User.findOne({ email });
        if (user) {
            return res.status(409).json({ error: "User already exist!" });
        };

        const salt = await bcrypt.genSalt(11);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = new User({
            name,
            email,
            role,
            password: hashedPassword,
        });

        await newUser.save();
    
        generateToken(newUser._id, newUser.role, res);

        return res.status(201).json({
            message: "Account created successfully",
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role
        });

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
        console.error("Error in register user:", error);
    }
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        
        if (
            !email ||
            !password
        ) {
            return res.status(400).json({ error: "Complete all fields." });
        };

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: "User not exists." });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Wrong Credentials" });
        }

        generateToken(user._id, user.role, res);

        return res.status(200).json({
            message: "Login successfully",
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        });


    } catch (error) {
        console.log("Error in User login", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getUser = async (req, res) => {
    try {

        const userId = req.user.userId;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
             _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        })
    } catch (error) {
        console.log("Error in User get method", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        return res.status(200).json(users);
    } catch (error) {
        console.error("Error in getAllUsers:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const logout = (req, res) => {
try {
    res.cookie("jwt", "", {
      maxAge: 0,
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });

    res.status(200).json({ message: "Logged out successfully" });
} catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
}
};