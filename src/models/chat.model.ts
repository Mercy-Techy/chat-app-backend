import mongoose, { Document, Schema } from "mongoose";

interface IChat extends Document {
  participants: mongoose.Types.ObjectId[];
  lastMessage: mongoose.Types.ObjectId;
  unread?: number;
  _id: mongoose.Types.ObjectId;
}

const ChatSchema = new Schema<IChat>(
  {
    participants: [
      { type: Schema.Types.ObjectId, ref: "User", required: true },
    ],
    lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
    unread: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const ChatModel = mongoose.model<IChat>("Chat", ChatSchema);

export { ChatModel, IChat };
