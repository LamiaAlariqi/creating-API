import express from 'express';
import { registerUserController, loginUserController, userProfileController, updateUserProfileController, deleteUserProfileController, forgotpasswordController, resetPasswordController, updatePasswordController } from '../controllers/UsersController.js';
import { isAuthenticatedUser, isAdmin, logoutUser } from '../util/userAuth.js';

const router = express.Router();

router.post('/register', registerUserController);
router.post('/login', loginUserController);
router.get('/logout', logoutUser);

// (تم تصحيح ترتيب الحماية هنا أيضاً بحيث يمر على الحماية قبل التنفيذ)
router.get('/user/:id', isAuthenticatedUser, userProfileController);
router.put('/user/update/:id', isAuthenticatedUser, updateUserProfileController);
// حذف المستخدم (مسموح للمسؤولين فقط)
router.delete('/user/delete/:id', isAuthenticatedUser, isAdmin("admin"), deleteUserProfileController);
router.put('/user/update/:id', isAuthenticatedUser, updateUserProfileController);
router.delete('/user/delete/:id', isAuthenticatedUser, isAdmin("admin"), deleteUserProfileController);
router.post('/reset-password/:token', resetPasswordController);
router.post('/forgot-password', forgotpasswordController);
router.put('/password/update', isAuthenticatedUser, updatePasswordController);

export default router;
