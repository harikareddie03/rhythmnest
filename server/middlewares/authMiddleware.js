// const jwt = require("jsonwebtoken");

// const verifyToken = (req, res, next) => {
//     let token;

//     // Check the Authorization header
//     const authHeader = req.headers["authorization"];
//     if (authHeader && authHeader.startsWith("Bearer ")) {
//         token = authHeader.split(" ")[1];
//     }
//     console.log("hello11", token);

//     // Fallback to cookies if no Authorization header is found
//     if (!token && req.cookies) {
//         token = req.cookies.token;
//     }
//     console.log("hello17", token);

//     if (!token) {
//         return res.status(401).json({ success: false, message: "No token provided" });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded;
//         next();
//     } catch (error) {
//         res.status(401).json({ success: false, message: "Invalid token" });
//     }
// };

// module.exports = verifyToken;

const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach the decoded token payload to the request
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Invalid token" });
    }
};

module.exports = verifyToken;