import express from "express";
import * as userController from "../controllers/userController.js";
import * as userMiddleware from "../middlewares/userMiddleware.js";
import validationResult from "../middlewares/validationResult.js";
import * as userValidator from "../validators/userValidator.js";

const router = express.Router();

router.get(
  "/allUsers",
  userMiddleware.isAuthenticated,
  userMiddleware.isAdmin,
  userController.getAllUsers,
);
router.get("/status", userController.userStatus);
router.get("/signout", userMiddleware.isAuthenticated, userController.signout);
router.get(
  "/:userId",
  userMiddleware.isAuthenticated,
  userMiddleware.isProfileOwnerOrFriendOrAdmin,
  userController.getUserById,
);

router.post(
  "/signup",
  ...userValidator.signupValidator,
  validationResult,
  userController.signup,
);
router.post("/signin", userController.signin);
router.post(
  "/check-password",
  userMiddleware.isAuthenticated,
  userController.checkPassword,
);

router.put(
  "/update/:userId",
  userMiddleware.isAuthenticated,
  userMiddleware.isProfileOwnerOrAdmin,
  ...userValidator.updateUserValidator,
  validationResult,
  userController.updateUser,
);
router.put(
  "/change-password",
  userMiddleware.isAuthenticated,
  ...userValidator.updatePasswordValidator,
  validationResult,
  userController.changePassword,
);
router.put(
  "/change-role",
  userMiddleware.isAuthenticated,
  userMiddleware.isAdmin,
  ...userValidator.updateRoleValidator,
  validationResult,
  userController.changeRole,
);

router.delete(
  "/remove/:userId",
  userMiddleware.isAuthenticated,
  userMiddleware.isAdmin,
  userController.removeUser,
);

export default router;
