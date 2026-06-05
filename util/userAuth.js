import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

export const isAuthenticatedUser = async (req, res, next) => {
    try {
        let token = req.cookies.token;

        // Support Authorization header for cross-origin requests (e.g. Vercel frontend)
        if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Plz Login first"
            });
        }

        const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log(decodedData);

        req.user = await User.findById(decodedData.id);

        next();

    } catch (error) {
        // يمكنكِ إضافة معالجة للخطأ هنا
        res.status(500).json({ message: error.message });
    }
};
export const logoutUser = async (req, res) => {
    try {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true
        });

        return res.status(200).json({
            success: true,
            message: "User logged out successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// التأكد من صلاحيات المستخدم (مثلاً: admin فقط)
export const isAdmin = (...roles) => {
    return (req, res, next) => {
        // إذا كان دور المستخدم الحالي غير موجود في قائمة الأدوار المسموح بها
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Role: ${req.user.role} is not allowed to access this resource`
            });
        }
        next();
    };
};