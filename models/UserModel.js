import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs"; // 1. أضيفي هذا الاستيراد
import Jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Enter your name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [3, "Name should have more than 3 characters"]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Enter your email"],
        validate: [validator.isEmail, "Enter valid email"]
    },
    password: {
        type: String,
        minLength: [8, "Password should be greater than 8 characters"],
        required: [true, "Enter your password"],
        select: false
    },
    profile: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: "user"
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
}, { timestamps: true });

// 2. أضيفي هذا الجزء هنا (قبل الـ export)
// بري معناه قبل الحفظ، يعني قبل ما يتم حفظ المستخدم في قاعدة البيانات، راح يتم تنفيذ هذا الكود
userSchema.pre("save", async function () {
    // إذا لم يتم تعديل الباسورد، انتقل للخطوة التالية بإنهاء الدالة
    // هذا يعني أنه إذا كان المستخدم يقوم بتحديث بياناته بدون تغيير كلمة المرور، فلن يتم إعادة تشفير كلمة المرور مرة أخرى
    if (!this.isModified("password")) {
        return; // يجب إضافة return هنا لمنعه من التكملة للأسفل
    }

    // تشفير الباسورد بقيمة ملح (salt) تساوي 10
    this.password = await bcrypt.hash(this.password, 10);
});
// إنشاء ميثود لتوليد JWT Token
userSchema.methods.getJwtToken = function () {
    return Jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "7d",
    });
}
//حل مشكلة عدم تشفير الباسورد عند تسجيل الدخول 
// مقارنة كلمة المرور
userSchema.methods.comparePassword = async function (enteredPassword) {
    // دخلنا الباسورد العادي (enteredPassword) ونقارنه بالمشفر (this.password)
    return await bcrypt.compare(enteredPassword, this.password);
};

// إنشاء توكن لإعادة تعيين كلمة المرور
userSchema.methods.getResetPasswordToken = function () {
    // Generating Token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

    return resetToken;
};

export default mongoose.model("User", userSchema);