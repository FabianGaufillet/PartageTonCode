import Channel from "../models/Channel.model.js";
import Relationship from "../models/Relationship.model.js";

export const isUserFriendWithMembers = async (req, res, next) => {
  try {
    const { members } = req.body;
    const relationships = await Relationship.findOne(
      { user: req.user._id },
      { _id: 0, friends: 1 },
    );
    if (members.every((member) => relationships.friends.includes(member))) {
      return next();
    }
    return next({
      status: 403,
      message: "You must be friends with all members to create a channel",
      data: null,
    });
  } catch (error) {
    return next({
      status: 500,
      message: error.message,
      data: error,
    });
  }
};

export const isChannelOwnerOrAdmin = async (req, res, next) => {
  try {
    const { channelId } = req.params;
    if (!channelId) {
      return next({
        status: 422,
        message: "Channel id is required",
        data: null,
      });
    }
    if ("admin" === req.user.role) {
      return next();
    }
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return next({ status: 404, message: "Channel not found", data: null });
    }
    if (channel.opener !== req.user._id) {
      return next({
        status: 403,
        message: "You are not allowed to perform this action",
        data: null,
      });
    }
    return next();
  } catch (error) {
    return next({
      status: 500,
      message: error.message,
      data: error,
    });
  }
};

export const isChannelMemberOrAdmin = async (req, res, next) => {
  try {
    const channelId = req.params?.channelId || req.body?.channelId;
    if (!channelId) {
      return next({
        status: 422,
        message: "Channel id is required",
        data: null,
      });
    }
    if ("admin" === req.user.role) {
      return next();
    }
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return next({ status: 404, message: "Channel not found", data: null });
    }
    if (
      !channel.members.find((member) => member === req.user._id) &&
      channel.opener !== req.user._id
    ) {
      return next({
        status: 403,
        message: "You are not allowed to perform this action",
        data: null,
      });
    }
    return next();
  } catch (error) {
    return next({
      status: 500,
      message: error.message,
      data: error,
    });
  }
};
