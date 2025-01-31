const isAuthenticated = (req, res, next) => {
    if (req.user) {
        return next();
    } else {
        return res.status(401).json({ message: "Please log in to continue" });
    }
};

module.exports = isAuthenticated;
