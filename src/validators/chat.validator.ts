import { body } from "express-validator";

export const messageValidator = [
  body("receiver", "Receiver is required").isMongoId(),
  body("content", "Content is required").notEmpty().isString(),
  body("type", "Message type is required")
    .notEmpty()
    .isIn(["text", "image", "video", "document"]),
];
