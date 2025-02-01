import Relationship from "../models/Relationship.model.js";
import mongoose from "mongoose";

export const validateStrangerId = (req, res, next) => {
  const { strangerId } = req.params;
  if (!strangerId) {
    return res
      .status(422)
      .json({ message: "Stranger id is required", data: null });
  }
  return next();
};

export const getRelationships = async (req, res, next) => {
  try {
    req.user.relationships = await Relationship.findOne({ user: req.user._id });
    if (!req.user.relationships) {
      const relationships = new Relationship({ user: req.user._id });
      await relationships.save();
      req.user.relationships = await Relationship.findOne({
        user: req.user._id,
      });
    }
    return next();
  } catch (error) {
    return next({ status: 500, message: error.message, data: error });
  }
};

export const getFriendRelationships = async (req, res, next) => {
  try {
    const { friendId } = req.params;
    req.friend = {
      _id: friendId,
      relationships: null,
    };
    req.friend.relationships = await Relationship.findOne({ user: friendId });
    return next();
  } catch (error) {
    return next({ status: 500, message: error.message, data: error });
  }
};

export const getStrangerRelationships = async (req, res, next) => {
  try {
    const { strangerId } = req.params;
    req.stranger = {
      _id: strangerId,
      relationships: null,
    };
    req.stranger.relationships = await Relationship.findOne({
      user: strangerId,
    });
    if (!req.stranger.relationships) {
      const relationships = new Relationship({ user: strangerId });
      await relationships.save();
      req.stranger.relationships = await Relationship.findOne({
        user: strangerId,
      });
    }
    return next();
  } catch (error) {
    return next({ status: 500, message: error.message, data: error });
  }
};

export const isUserSelfRequest = (req, res, next) => {
  if (req.user._id === req.stranger._id) {
    return next({
      status: 403,
      message: "You cannot ask for yourself",
      data: null,
    });
  }
  return next();
};

export const isUserFriendWith = (req, res, next) => {
  if (!req.user.relationships.friends.includes(req.friend._id)) {
    return next({ status: 403, message: "You are not friends", data: null });
  }
  return next();
};

export const isUserAlreadyFriendWith = (req, res, next) => {
  if (req.user.relationships.friends.includes(req.stranger._id)) {
    return next({
      status: 403,
      message: "You are already friends",
      data: null,
    });
  }
  return next();
};

export const isFriendshipAlreadyAsked = (req, res, next) => {
  if (req.stranger.relationships.pendings.includes(req.user._id)) {
    return next({
      status: 403,
      message: "You have already asked this user for friendship",
      data: null,
    });
  }
  return next();
};

export const isSuggestionAlreadyDone = (req, res, next) => {
  if (
    req.stranger.relationships.suggested.includes(
      (el) => el.user === req.friend._id && el.by.includes(req.user._id),
    )
  ) {
    return next({
      status: 403,
      message: "You have already suggested this user",
      data: null,
    });
  }
  return next();
};

export const isUserIgnored = (req, res, next) => {
  if (req.user.relationships.ignored.includes(req.stranger._id)) {
    return next({
      status: 403,
      message: "You have ignored this user",
      data: null,
    });
  } else if (req.stranger.relationships.ignored.includes(req.user._id)) {
    return next({
      status: 403,
      message: "You are ignored by this user",
      data: null,
    });
  }
  return next();
};

export const isStrangerAlreadyFriendWithSuggested = (req, res, next) => {
  if (req.stranger.relationships.friends.includes(req.friend._id)) {
    return next({
      status: 403,
      message: "These users are already friends",
      data: null,
    });
  }
  return next();
};

export const isStrangerOrSuggestedIgnored = (req, res, next) => {
  if (
    req.stranger.relationships.ignored.includes(req.friend._id) ||
    req.friend.relationships.ignored.includes(req.stranger._id)
  ) {
    return next({
      status: 403,
      message: "These Users can't be friends",
      data: null,
    });
  }
  return next();
};
