import * as express from "express";
import { deleteMe, updateMe, updateUser } from "../controllers/userController";
import {
    signup,
    login,
    logout,
    signupOrganization,
    protect,
    forgotPassword,
    resetPassword,
    updatePassword,
    currentUser,
    allUsers
} from "../controllers/authController";
import { deleteUsersByIds } from "../controllers/userController";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/signuporganization", signupOrganization);
router.get("/logout", logout);

router.post("/forgotpassword", forgotPassword);
router.patch("/resetpassword/:token", resetPassword);

// Protect all routes after this middleware
router.use(protect);

router.patch("/updatemypassword", updatePassword);
router.delete("/deleteme", deleteMe);

router.get("/currentuser", currentUser);
router.get("/all", allUsers);
router.patch("/updateme", updateMe);

router.route("/").delete(deleteUsersByIds);

router.route("/:id").patch(updateUser);

export default router;
