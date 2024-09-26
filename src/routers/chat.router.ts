import { Router } from "express";
import validator from "../middleware/validator";
import authenticator from "../middleware/authenticator";
import { parser } from "../utilities/fileUploader";
import {
  fetchChat,
  fetchChats,
  sendMessage,
} from "../controllers/chat.controller";
import { messageValidator } from "../validators/chat.validator";

const router = Router();

router.post(
  "/send-message",
  authenticator,
  messageValidator,
  validator,
  sendMessage
);
router.get("/chats", authenticator, fetchChats);
router.get("/:chatId", authenticator, fetchChat);

export default router;
