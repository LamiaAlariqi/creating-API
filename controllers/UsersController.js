import User from '../models/UserModel.js';
import crypto from 'crypto';
import { sendToken } from '../util/jwtToken.js';
import { sendEmail } from '../util/sendmail.js';

export const registerUserController = async (req, res) => {
    try {
        // 1. استلام البيانات من الطلب (req.body)
        const { name, email, password, profile, role } = req.body;

        // 2. إنشاء المستخدم في قاعدة البيانات
        const user = await User.create({
            name,
            email,
            password,
            role, // إضافة الرول هنا
            profile: {
                public_id: "id",
                url: "url"
            }
        });

        // 3. التحقق مما إذا تم إنشاء المستخدم بنجاح
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "user not created successfully"
            });
        }

        // 4. إرسال رد النجاح
        // return res.status(201).json({
        //     success: true,
        //     message: "User registered successfully",
        //     user
        // });
        sendToken(user, 200, res);

    } catch (error) {
        // 5. التعامل مع الأخطاء (مثل إيميل مكرر أو بيانات ناقصة)
        return res.status(500).json({
            success: false,
            message: "Error in registration",
            error: error.message
        });
    }
};

export const loginUserController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password cannot be empty"
            });
        }

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        const isPasswordMatched = await user.comparePassword(password);
        // هنا قمنا باستخدام الميثود اللي أضفناها في الموديل لمقارنة كلمة المرور المدخلة مع الكلمة المشفرة في قاعدة البيانات
        if (!isPasswordMatched) {
            return res.status(401).json({
                success: false,
                message: "Email or Password incorrect"
            });
        }
        // if (user.password !== password) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "Email or Password incorrect"
        //     });
        // }


        sendToken(user, 200, res);

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in login",
            error: error.message
        });
    }
};
//find the user by id

export const userProfileController = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in getting user profile",
            error: error.message
        });
    }
};
export const updateUserProfileController = async (req, res) => {
    try {
        // 1. البحث عن المستخدم أولاً للتأكد من وجوده
        // let user = await User.findById(req.params.id);

        // if (!user) {
        //     return res.status(404).json({
        //         success: false,
        //         message: "User not found"
        //     });
        // }
        // 2. تحديث البيانات باستخدام الحقول المرسلة في req.body
        let user = await User.findByIdAndUpdate(req.user._id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        })

        // 2. تحديث البيانات باستخدام الحقول المرسلة في req.body
        user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,           // لكي تعود لك البيانات "بعد" التعديل وليس قبله
            runValidators: true, // للتأكد من أن البيانات الجديدة تطابق شروط السكيما
            useFindAndModify: false
        });

        // 3. إرسال رد النجاح مع بيانات المستخدم المحدثة
        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in updating profile",
            error: error.message
        });
    }
};
export const deleteUserProfileController = async (req, res) => {
    try {
        // 1. البحث عن المستخدم أولاً قبل محاولة الحذف
        // let user = await User.findById(req.params.id);

        // if (!user) {
        //     return res.status(404).json({
        //         success: false,
        //         message: "user not found"
        //     });
        // }
        //عشان اخذ الاي دي من الكوكيز مش params
        let user = await User.findByIdAndDelete(req.user._id)

        // 2. تنفيذ عملية الحذف من قاعدة البيانات
        user = await User.findByIdAndDelete(req.params.id);

        // 3. إرسال رد النجاح
        return res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error) {
        // 4. التعامل مع أي خطأ تقني (مثل ID غير صالح)
        return res.status(500).json({
            success: false,
            message: "Error in deleting user profile",
            error: error.message
        });
    }
};
export const forgotpasswordController = async (req, res) => {
    let user;
    try {
        const { email } = req.body;
        user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });
        const resetUrl = `http://localhost:5173/password/reset-password/${resetToken}`;
        const message = `Your password reset token is:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.`;
        await sendEmail({
            email: user.email,
            subject: "Password Reset Request",
            message
        });
        return res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
            resetToken
        });
    } catch (error) {
        if (user) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
        }
        return res.status(500).json({
            success: false,
            message: "Error in sending password reset email",
            error: error.message
        });
    }
};

export const resetPasswordController = async (req, res) => {
    try {
        console.log(req.params.token);
        const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid token or its been expired"
            })
        }

        const { password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password doesnt match to each other"
            })
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();
        sendToken(user, 200, res)
    } catch (error) {
        return res.status(500).json({
            success: false,
            error
        })
    }
}

export const updatePasswordController = async (req, res) => {
    try {
        console.log("in try block");

        // 1. استلام البيانات من الطلب (فلاتر ترسل هذه البيانات في الـ Body)
        const { oldPassword, newPassword, confirmNewPassword } = req.body;

        // 2. جلب بيانات المستخدم من قاعدة البيانات (بما في ذلك حقل الباسورد المشفر)
        const user = await User.findById(req.user.id).select("+password");

        // 3. التحقق من تطابق كلمة المرور القديمة مع المخزنة
        const isPasswordMatched = await user.comparePassword(oldPassword);

        if (!isPasswordMatched) {
            return res.status(400).json({
                success: false,
                message: "Old password is incorrect"
            });
        }

        // 4. التحقق من تطابق كلمة المرور الجديدة مع تأكيدها
        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: "New Password doesn't match with Confirm Password"
            });
        }

        // 5. تعيين كلمة المرور الجديدة وحفظها
        user.password = newPassword;
        await user.save();

        // 6. الرد بالنجاح
        res.status(200).json({
            success: true,
            message: "Password Updated Successfully"
        });

    } catch (error) {
        // في حال حدوث خطأ 500
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

export const getAllUsersController = async (req, res) => {
    try {
        const users = await User.find({});
        return res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in getting all users",
            error: error.message
        });
    }
};

export const getUserDetailsController = async (req, res) => {
    try {
        // req.user is set by the isAuthenticatedUser middleware
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in getting user details",
            error: error.message
        });
    }
};

export const getUserRoleController = async (req, res) => {
    try {
        // req.user is set by the isAuthenticatedUser middleware
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            role: user.role
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in getting user role",
            error: error.message
        });
    }
};

export const updateUserRoleController = async (req, res) => {
    try {
        const { role } = req.body;

        if (!role || (role !== 'admin' && role !== 'user')) {
            return res.status(400).json({
                success: false,
                message: "Invalid role specified"
            });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User role updated successfully",
            user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in updating user role",
            error: error.message
        });
    }
};