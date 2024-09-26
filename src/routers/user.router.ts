import { Router } from "express";
import {
  changeSecret,
  fetchUserDetails,
  uploadAvatar,
  editUserName,
  fetchUsers,
  searchUsers,
} from "../controllers/user.controller";
import {
  secretValidator,
  usernameValidator,
} from "../validators/user.validators";
import validator from "../middleware/validator";
import authenticator from "../middleware/authenticator";
import { parser } from "../utilities/fileUploader";

const router = Router();

router.get("/", authenticator, fetchUserDetails);
router.get("/users", authenticator, fetchUsers);
router.get("/users/search", authenticator, searchUsers);
router.post(
  "/edit-username",
  authenticator,
  usernameValidator,
  validator,
  editUserName
);
router.post(
  "/change-secret",
  authenticator,
  secretValidator,
  validator,
  changeSecret
);
router.post(
  "/upload-avatar",
  authenticator,
  parser.single("avatar"),
  uploadAvatar
);

export default router;
