import { cloudinaryReturnType, file } from "../types";
import cloudinary from "cloudinary";
import multer from "multer";
import { FileModel } from "../models/file.model";
import { Types } from "mongoose";

const { config, uploader } = cloudinary.v2;

config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const parser = multer({ storage: multer.diskStorage({}) });

const fileUploader = async (
  path: string,
  public_id?: string
): Promise<cloudinaryReturnType> => {
  const obj: any = {
    resource_type: "auto",
    folder: "cetmas",
  };
  if (public_id) {
    obj.public_id = public_id;
  }
  const data = await uploader.upload(path, obj);
  return data;
};

export const createFile = async (file: file, fileId?: any) => {
  try {
    let fileObject: any = { path: file.path };
    let editedFile;
    if (fileId) {
      editedFile = await FileModel.findById(fileId);
      if (editedFile) {
        fileObject.public_id = editedFile.public_id;
      }
    }
    const { url, public_id, format, bytes, resource_type } = await fileUploader(
      fileObject.path,
      fileObject.public_id
    );
    let createdFile;
    if (editedFile) {
      createdFile = editedFile;
    } else {
      createdFile = await FileModel.create({
        url,
        public_id,
        format,
        type: resource_type,
        size: (bytes / 1024 / 1024).toFixed(2) + "mb",
        mimetype: file.mimetype,
      });
    }
    return { status: true, message: "File created", data: createdFile };
  } catch (error: any) {
    return { status: false, message: error.message, data: null };
  }
};
