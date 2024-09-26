import { prop, Ref, pre, getModelForClass } from "@typegoose/typegoose";
import mongoose from "mongoose";
import { File } from "./file.model";
import bcrypt from "bcryptjs";

@pre<User>("save", function (next) {
  if (this.isModified("password")) {
    const saltRounds = 12;
    this.password = bcrypt.hashSync(this.password, saltRounds);
  }
  next();
})
@pre<User>("save", function (next) {
  if (this.isModified("secret")) {
    const saltRounds = 12;
    this.secret = bcrypt.hashSync(this.secret, saltRounds);
  }
  next();
})
export class User {
  @prop({ required: true, trim: true, lowercase: true, unique: true })
  username!: string;

  @prop({
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    immutable: true,
  })
  email!: string;

  @prop({ required: true, select: false })
  password!: string;

  @prop({ required: true, select: false })
  secret!: string;

  @prop({ ref: () => File })
  avatar?: Ref<File>;

  @prop()
  lastLogin!: Date;
}

export const UserModel = getModelForClass(User);
export interface IUser extends mongoose.Document, User {
  _id: mongoose.Types.ObjectId;
}
