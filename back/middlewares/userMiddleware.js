import Relationship from "../models/Relationship.model.js";

export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return next({ status: 401, message: "Not authenticated" });
};

export const isAdmin = (req, res, next) => {
  if ("admin" === req.user.role) {
    return next();
  }
  return next({
    status: 403,
    message: "You are not allowed to perform this action",
  });
};

export const isProfileOwnerOrAdmin = (req, res, next) => {
  const { userId } = req.params;
  if (!userId) {
    return next({ status: 422, message: "User id is required", data: null });
  }
  if (userId === req.user._id.toString() || "admin" === req.user.role) {
    return next();
  }
  return next({
    status: 403,
    message: "You are not allowed to perform this action",
  });
};

export const isProfileOwnerOrFriendOrAdmin = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return next({ status: 422, message: "User id is required", data: null });
    }
    if ("admin" === req.user.role || userId === req.user._id.toString()) {
      return next();
    }
    const relationships = await Relationship.findOne(
      { user: req.user._id },
      { _id: 0, friends: 1 },
    );
    if (!relationships.friends.includes(userId)) {
      return next({
        status: 403,
        message: "You are not allowed to perform this action",
        data: null,
      });
    }
    return next();
  } catch (error) {
    return next({ status: 500, message: error.message, data: error });
  }
};
