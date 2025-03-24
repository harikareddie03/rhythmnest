const isAuthenticated = (req, res, next) => {
    if (req.user) {
        return next();
    } else {
        return res.status(401).json({ message: "Please log in to continue" });
    }
};

module.exports = isAuthenticated;
// const jwt = require("jsonwebtoken");
// const User = require("../Models/User");

// module.exports = async function isAuthenticated(req, res, next) {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//         console.log("❌ No token provided");
//         return res.status(401).json({ success: false, message: "Unauthorized - No token provided" });
//     }

//     const token = authHeader.split(" ")[1]; // Extract token

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         console.log("✅ Token decoded:", decoded);

//         req.user = await User.findById(decoded.id).select("-password");
//         if (!req.user) {
//             console.log("❌ User not found for token ID:", decoded.id);
//             return res.status(401).json({ success: false, message: "Unauthorized - Invalid token" });
//         }

//         console.log("✅ Authenticated User:", req.user.username);
//         next();
//     } catch (error) {
//         console.error("❌ Token verification failed:", error.message);
//         return res.status(401).json({ success: false, message: "Unauthorized - Token verification failed" });
//     }
// };
