import Relationship from "../models/Relationship.model.js";

export const getRelationships = async (query, populate) => {
  try {
    const relationships = await Relationship.find(query).populate(populate);
    if (!relationships) {
      return { status: 404, message: "No relationships found", data: null };
    }
    return { status: 200, message: "Relationships found", data: relationships };
  } catch (error) {
    return { status: 500, message: error.message, data: error };
  }
};

export const askForFriendship = async (user, stranger) => {
  try {
    const relationships = stranger.relationships;
    relationships.pendings.push(user._id);
    await relationships.save();
    return {
      status: 200,
      message: "Friendship request sent",
      data: relationships,
    };
  } catch (error) {
    return { status: 500, message: error.message, data: error };
  }
};

export const acceptFriendshipRequest = async (user, stranger) => {
  try {
    let relationships = user.relationships;
    let index = relationships.pendings.indexOf(stranger._id);
    let save = false;
    if (-1 !== index) {
      relationships.pendings.splice(index, 1);
      relationships.friends.push(stranger._id);
      save = true;
    }
    index = relationships.suggested.map((el) => el.user).indexOf(stranger._id);
    if (-1 !== index) {
      relationships.suggested.splice(index, 1);
      save = true;
    }
    if (save) {
      await relationships.save();
      save = false;
    }

    relationships = stranger.relationships;
    index = relationships.pendings.indexOf(user._id);
    if (-1 !== index) {
      relationships.pendings.splice(index, 1);
      relationships.friends.push(user._id);
      save = true;
    }
    index = relationships.suggested.map((el) => el.user).indexOf(user._id);
    if (-1 !== index) {
      relationships.suggested.splice(index, 1);
      save = true;
    }
    if (save) {
      await relationships.save();
    }

    return {
      status: 200,
      message: "Friendship request accepted",
      data: relationships,
    };
  } catch (error) {
    return { status: 500, message: error.message, data: error };
  }
};

export const denyFriendshipRequest = async (userId, strangerId) => {
  try {
    const relationships = await Relationship.findById(userId);
    const index = relationships.pendings.indexOf(strangerId);
    if (-1 !== index) {
      relationships.pendings.splice(index, 1);
      await relationships.save();
    }
    return {
      status: 200,
      message: "Friendship request denied",
      data: relationships,
    };
  } catch (error) {
    return { status: 500, message: error.message, data: error };
  }
};

export const suggestFriendship = async (userId, friendId, stranger) => {
  try {
    const relationships = stranger.relationships;
    const index = relationships.suggested
      .map((el) => el.user)
      .indexOf(friendId);
    if (-1 !== index) {
      relationships.suggested[index].by.push(userId);
    } else {
      relationships.suggested.push({ user: friendId, by: [userId] });
    }
    await relationships.save();
    return { status: 200, message: "Suggestion sent", data: relationships };
  } catch (error) {
    return { status: 500, message: error.message, data: error };
  }
};

export const ignoreSuggestion = async (user, strangerId) => {
  try {
    const relationships = user.relationships;
    const index = relationships.suggested
      .map((el) => el.user)
      .indexOf(strangerId);
    if (-1 !== index) {
      relationships.suggested.splice(index, 1);
      await relationships.save();
    }
    return { status: 200, message: "Suggestion ignored", data: relationships };
  } catch (error) {
    return { status: 500, message: error.message, data: error };
  }
};

export const removeFriend = async (user, friend) => {
  try {
    let relationships = user.relationships;
    let index = relationships.friends.indexOf(friend._id);
    if (-1 !== index) {
      relationships.friends.splice(index, 1);
      await relationships.save();
    }
    relationships = friend.relationships;
    index = relationships.friends.indexOf(user._id);
    if (-1 !== index) {
      relationships.splice(index, 1);
      await relationships.save();
    }
    return { status: 200, message: "Friend removed", data: relationships };
  } catch (error) {
    return { status: 500, message: error.message, data: error };
  }
};
