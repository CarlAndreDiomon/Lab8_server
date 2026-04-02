import jwt from 'jsonwebtoken';

export const generateToken = (userId, role, res) => {
    const token = jwt.sign({ userId, role }, process.env.JWT_SECRET, {
        expiresIn: "30d"
    });

    res.cookie("jwt", token, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'None',
        secure: true,
    });

    return token;
};