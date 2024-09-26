import { NextFunction, Request, Response } from "express";
import { Req } from "../types";
import { ChatModel } from "../models/chat.model";
import { Types } from "mongoose";
import { IMessage, MessageModel } from "../models/message.model";
import response from "../utilities/response";
import Paginator from "../utilities/paginator";
import { UserModel } from "../models/user.model";

export const sendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as Req).user;
    const { content, receiver, type } = req.body;
    if (receiver === user._id.toString())
      throw new Error("You cannot send a message to yourself");
    const existing = await UserModel.findById(receiver);
    if (!existing) throw new Error("Receiver is not a user");
    let chat = await ChatModel.findOne({
      participants: {
        $all: [Types.ObjectId.createFromHexString(receiver), user._id],
        $size: 2,
      },
    });
    if (!chat) {
      chat = await ChatModel.create({
        participants: [Types.ObjectId.createFromHexString(receiver), user._id],
      });
    }
    //upload file message
    const message = await MessageModel.create({
      content,
      chatId: chat._id,
      type,
      sender: user._id,
    });
    chat.unread = (chat.unread || 0) + 1;
    chat.lastMessage = message._id;
    await chat.save();
    return response(res, "Message sent");
  } catch (error: any) {
    next(error);
  }
};

export const fetchChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as Req).user;
    const page = +(req.query?.page || 1);
    const details = await Paginator(
      ChatModel,
      page,
      10,
      [
        {
          path: "lastMessage",
          select: "content sender updatedAt",
          populate: {
            path: "sender",
            model: "User",
            select: "username",
          },
        },
        {
          path: "participants",
          select: "username avatar",
          populate: {
            path: "avatar",
            model: "File",
            select: "url",
          },
        },
      ],
      { participants: { $in: [user._id] } },
      { createdAt: -1 }
    );
    if (!details.status) throw new Error(details.message);
    return response(res, "Users", details.data);
  } catch (error: any) {
    next(error);
  }
};

export const fetchChat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const chatId = Types.ObjectId.createFromHexString(req.params.chatId);
    const user = (req as Req).user;
    const page = +(req.query?.page || 1);
    const messages = await MessageModel.find({ chatId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * 20)
      .limit(20);

    //socket
    await MessageModel.updateMany(
      { chatId, sender: { $ne: user._id }, read: false },
      { read: true }
    );
    return response(res, "Messages", messages);
  } catch (error: any) {
    next(error);
  }
};
