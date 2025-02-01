import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import {
  emailRegex,
  minAge,
  userNameMaxLength,
  userNameMinLength,
} from "../utils/constants.js";
import mongoosePaginate from "mongoose-paginate-v2";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const validateEmail = (email) => {
  return emailRegex.test(email);
};

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      minlength: [
        userNameMinLength,
        `Username must be at least ${userNameMinLength} characters long`,
      ],
      maxlength: [
        userNameMaxLength,
        `Username must be less than ${userNameMaxLength} characters long`,
      ],
      required: [true, "Username is required"],
      unique: true,
    },
    email: {
      type: String,
      trim: true,
      validate: [validateEmail, "Please fill a valid email address"],
      required: [true, "Email is required"],
      unique: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    avatar: {
      type: [String],
      default: [],
    },
    lastname: {
      type: String,
      trim: true,
      required: [true, "Lastname is required"],
    },
    firstname: {
      type: String,
      trim: true,
      required: [true, "Firstname is required"],
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: [true, "Gender is required"],
    },
    age: {
      type: Number,
      min: [minAge, `Age must be greater than ${minAge} years`],
      required: [true, "Age is required"],
    },
    street: {
      type: String,
      trim: true,
    },
    zipcode: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.plugin(passportLocalMongoose, {
  limitAttempts: true,
  maxAttempts: 5,
});
userSchema.plugin(mongoosePaginate);
userSchema.plugin(mongooseAggregatePaginate);

const User = mongoose.model("users", userSchema);
export default User;
