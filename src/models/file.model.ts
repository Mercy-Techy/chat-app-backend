import { prop, getModelForClass } from "@typegoose/typegoose";
import mongoose from "mongoose";

export class File {
  @prop({ required: true })
  url!: string;

  @prop({ required: true })
  public_id!: string;

  @prop({ required: true, enum: ["image", "video", "raw"] })
  type!: string;

  @prop()
  size!: string;

  @prop()
  mimetype!: string;

  @prop()
  format!: string;
}

export const FileModel = getModelForClass(File);
export interface IFile extends mongoose.Document, File {
  _id: mongoose.Types.ObjectId;
}
