import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized: No token provided"
        });
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decoded.userId;

        next();

    } catch (error) {

        console.error("Authentication Error:", error);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Token expired. Please login again."
            });
        }

        return res.status(401).json({
            message: "Unauthorized: Invalid token"
        });
    }
};

export default isAuth;