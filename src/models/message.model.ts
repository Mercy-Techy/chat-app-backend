import mongoose, { Document, Schema } from "mongoose";

interface IMessage extends Document {
  sender: mongoose.Types.ObjectId;
  content: string;
  type: "text" | "image" | "video" | "document";
  chatId: mongoose.Types.ObjectId;
  _id: mongoose.Types.ObjectId;
  read: boolean;
}

const MessageSchema = new Schema<IMessage>(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    type: {
      type: String,
      enum: ["text", "image", "video", "document"],
      required: true,
    },
    chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);
const MessageModel = mongoose.model<IMessage>("Message", MessageSchema);

export { MessageModel, IMessage };
