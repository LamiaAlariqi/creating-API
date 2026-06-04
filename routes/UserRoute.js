import express from 'express';
import { registerUserController, loginUserController, userProfileController, updateUserProfileController, deleteUserProfileController, forgotpasswordController, resetPasswordController, updatePasswordController, getAllUsersController, getUserDetailsController, getUserRoleController, updateUserRoleController } from '../controllers/UsersController.js';
import { combineData } from '../controllers/OrderController.js';
import { isAuthenticatedUser, isAdmin, logoutUser } from '../util/userAuth.js';

const router = express.Router();

router.post('/register', registerUserController);
router.post('/login', loginUserController);
router.get('/logout', logoutUser);
router.get('/me', isAuthenticatedUser, getUserDetailsController);
router.get('/user/role', isAuthenticatedUser, getUserRoleController);

// (تم تصحيح ترتيب الحماية هنا أيضاً بحيث يمر على الحماية قبل التنفيذ)
router.get('/user/:id', isAuthenticatedUser, userProfileController);
router.put('/user/update', isAuthenticatedUser, updateUserProfileController);
// حذف المستخدم (مسموح للمسؤولين فقط)
router.delete('/user/delete/:id', isAuthenticatedUser, isAdmin("admin"), deleteUserProfileController);
router.put('/user/update/:id', isAuthenticatedUser, updateUserProfileController);
router.delete('/user/delete/:id', isAuthenticatedUser, isAdmin("admin"), deleteUserProfileController);
router.post('/reset-password/:token', resetPasswordController);
router.post('/forgot-password', forgotpasswordController);
router.put('/password/update', isAuthenticatedUser, updatePasswordController);
router.get('/all_users', isAuthenticatedUser, isAdmin("admin"), getAllUsersController);
router.get('/users/combine-data', isAuthenticatedUser, isAdmin("admin"), combineData);
router.put('/admin/user/role/:id', isAuthenticatedUser, isAdmin("admin"), updateUserRoleController);

export default router;
