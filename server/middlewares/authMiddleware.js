
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.header("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Invalid authorization header" });
        }
    const token = authHeader?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Invalid token" });
    }
};

module.exports = verifyToken;