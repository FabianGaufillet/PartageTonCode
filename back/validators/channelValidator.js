import { body } from "express-validator";
import mongoose from "mongoose";

export const channelValidator = [
  body("members")
    .if(body("members").exists())
    .isArray()
    .withMessage("Members must be an array")
    .custom((members) => {
      return members.every((id) => mongoose.Types.ObjectId.isValid(id));
    })
    .withMessage("Every member ID must be a valid MongoDB ObjectId"),
];
