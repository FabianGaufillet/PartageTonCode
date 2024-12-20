import Message from "../models/Message.model.js";

export const getMessages = async (channelId) => {
  try {
    const messages = await Message.find({ channel: channelId });
    if (!messages) {
      return { status: 404, message: "Messages not found", data: null };
    }
    return { status: 200, message: "Messages found", data: messages };
  } catch (error) {
    return { status: 500, message: error.message, data: error };
  }
};

export const createMessage = async (channelId, userId, content) => {
  try {
    const messageCreated = await Message.create({
      channel: channelId,
      author: userId,
      content: content,
    });
    return { status: 201, message: "Message created", data: messageCreated };
  } catch (error) {
    return { status: 500, message: error.message, data: error };
  }
};

export const deleteMessage = async (messageId) => {
  try {
    const messageDeleted = await Message.findByIdAndDelete(messageId);
    if (!messageDeleted) {
      return { status: 404, message: "Message not found", data: null };
    }
    return { status: 200, message: "Message deleted", data: messageDeleted };
  } catch (error) {
    return { status: 500, message: error.message, data: error };
  }
};
