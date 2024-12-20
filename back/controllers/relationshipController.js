import * as relationshipHelper from "../helpers/relationshipHelper.js";

const getPopulate = (type) => {
  return "suggested" === type
    ? [
        { path: "suggested.by", sort: { username: 1 } },
        { path: "suggested.user", sort: { username: 1 } },
      ]
    : [{ path: type, sort: { username: 1 } }];
};

export const getRelationships = async (req, res) => {
  try {
    const { userId } = req.params;
    const type =
      req.params.type || req.originalUrl.contains("friends") ? "friends" : null;
    if (!userId || !type) {
      return res.status(422).json({ message: "User id and type are required" });
    }
    const query = { user: userId };
    const populate = getPopulate(type);
    const { status, message, data } = await relationshipHelper.getRelationships(
      query,
      populate,
    );
    return res.status(status).json({ message, data });
  } catch (error) {
    return res.status(500).json({ message: error.message, data: error });
  }
};

export const askForFriendship = async (req, res) => {
  try {
    const { status, message, data } = await relationshipHelper.askForFriendship(
      req.user,
      req.stranger,
    );
    return res.status(status).json({ message, data });
  } catch (error) {
    return res.status(500).json({ message: error.message, data: error });
  }
};

export const acceptFriendshipRequest = async (req, res) => {
  try {
    const { status, message, data } =
      await relationshipHelper.acceptFriendshipRequest(req.user, req.stranger);
    return res.status(status).json({ message, data });
  } catch (error) {
    return res.status(500).json({ message: error.message, data: error });
  }
};

export const denyFriendshipRequest = async (req, res) => {
  try {
    const { strangerId } = req.params;
    const { status, message, data } =
      await relationshipHelper.denyFriendshipRequest(req.user._id, strangerId);
    return res.status(status).json({ message, data });
  } catch (error) {
    return res.status(500).json({ message: error.message, data: error });
  }
};

export const suggestFriendship = async (req, res) => {
  try {
    const { status, message, data } =
      await relationshipHelper.suggestFriendship(
        req.user._id,
        req.friend._id,
        req.stranger,
      );
    return res.status(status).json({ message, data });
  } catch (error) {
    return res.status(500).json({ message: error.message, data: error });
  }
};

export const ignoreSuggestion = async (req, res) => {
  try {
    const { strangerId } = req.params;
    const { status, message, data } = await relationshipHelper.ignoreSuggestion(
      req.user,
      strangerId,
    );
    return res.status(status).json({ message, data });
  } catch (error) {
    return res.status(500).json({ message: error.message, data: error });
  }
};

export const removeFriend = async (req, res) => {
  try {
    const { status, message, data } = await relationshipHelper.removeFriend(
      req.user,
      req.friend,
    );
    return res.status(status).json({ message, data });
  } catch (error) {
    return res.status(500).json({ message: error.message, data: error });
  }
};

export const removeFriendFromProfile = async (req, res) => {
  try {
    const { status, message, data } = await relationshipHelper.removeFriend(
      req.stranger,
      req.friend,
    );
    return res.status(status).json({ message, data });
  } catch (error) {
    return res.status(500).json({ message: error.message, data: error });
  }
};
