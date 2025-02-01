import User from "../models/User.model.js";
import { tempFolder, uploadPath } from "../utils/constants.js";
import * as fs from "node:fs";
import { generate } from "generate-password";
import passwordGeneratorOptions from "../config/passwordGenerator.js";

export const getUserById = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return { status: 404, message: "User not found", data: null };
    }
    return { status: 200, message: "User found", data: user };
  } catch (error) {
    return { status: 500, message: error.message, data: error };
  }
};

export const getAllPotentialFriends = async (user, match, options) => {
  try {
    const agg = match ? [{ $match: match }] : [];
    agg.push(
      {
        $lookup: {
          from: "relationships",
          localField: "_id",
          foreignField: "user",
          as: "relationships",
        },
      },
      {
        $unwind: {
          path: "$relationships",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          $and: [
            {
              _id: {
                $ne: user._id,
              },
            },
            {
              "relationships.friends": {
                $nin: [user._id],
              },
            },
            {
              "relationships.pendings": {
                $nin: [user._id],
              },
            },
            {
              "relationships.ignored": {
                $nin: [user._id],
              },
            },
          ],
        },
      },
    );
    const aggregate = User.aggregate(agg);
    const allUsers = await User.aggregatePaginate(aggregate, options);
    if (!allUsers.totalDocs) {
      return { status: 404, message: "No users found", data: null };
    }
    const excludedIds = [
      user.relationships.friends.map((friend) => String(friend._id)),
      user.relationships.pendings.map((friend) => String(pending._id)),
      user.relationships.ignored.map((ignore) => String(ignore._id)),
    ];
    const docs = allUsers.docs.filter(
      (doc) => !excludedIds.includes(String(doc._id)),
    );
    return { status: 200, message: "Users found", data: allUsers };
  } catch (error) {
    return { status: 500, message: error.message, data: error };
  }
};

export const signup = async (userObject, password) => {
  try {
    await User.register(new User(userObject), password);
    return { status: 201, message: "Registration successful", data: null };
  } catch (error) {
    return { status: 409, message: error.message, data: error };
  }
};

export const updateUser = async (id, update, options) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(id, update, options);
    if (!updatedUser) {
      return { status: 404, message: "User not found", data: null };
    }
    return { status: 204, message: "User updated", data: updatedUser };
  } catch (error) {
    return { status: 500, message: error.message, data: error };
  }
};

export const changePassword = async (id, oldPassword, password) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return { status: 404, message: "User not found", data: null };
    }
    const authenticationResult = await user.authenticate(oldPassword);
    if (!authenticationResult.user) {
      return { status: 401, message: "Wrong Password", data: null };
    }
    await user.setPassword(password);
    await user.save();
    return { status: 204, message: "Password changed", data: user };
  } catch (error) {
    return { status: 500, message: error.message, data: error };
  }
};

export const changeRole = async (id, role, options) => {
  try {
    const user = await User.findByIdAndUpdate(id, { role }, options);
    if (!user) {
      return { status: 404, message: "User not found", data: null };
    }
    return { status: 204, message: "Role changed", data: user };
  } catch (error) {
    return { status: 500, message: error.message, data: error };
  }
};

export const checkPassword = async (id, password) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return { status: 404, message: "User not found", data: null };
    }
    const authenticationResult = await user.authenticate(password);
    if (!authenticationResult.user) {
      return { status: 401, message: "Wrong Password", data: null };
    }
    return { status: 200, message: "Correct Password", data: user };
  } catch (error) {
    return { status: 500, message: error.message, data: error };
  }
};

export const resetPassword = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return { status: 404, message: "User not found", data: null };
    }
    const newPassword = generate({ passwordGeneratorOptions });
    await user.setPassword(newPassword);
    await user.save();
    return {
      status: 200,
      message: "Password reset successful.",
      data: newPassword,
    };
  } catch (error) {
    return { status: 500, message: error.message, data: error };
  }
};

export const removeUser = async (id) => {
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return { status: 404, message: "User not found", data: null };
    }
    return { status: 204, message: "User deleted", data: null };
  } catch (error) {
    return { status: 500, message: error.message, data: error };
  }
};
