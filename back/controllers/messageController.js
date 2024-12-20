import * as messageHelper from "../helpers/messageHelper.js";

export const getMessages = async (req, res) => {
  try {
    const { channelId } = req.params;
    if (!channelId) {
      return res.status(422).json({ message: "Channel id is required" });
    }
    const { status, message, data } =
      await messageHelper.getMessages(channelId);
    return res.status(status).json({ message, data });
  } catch (error) {
    return res.status(500).json({ message: error.message, data: error });
  }
};

export const createMessage = async (req, res) => {
  try {
    const { channelId, content } = req.body;
    const { status, message, date } = await messageHelper.createMessage(
      channelId,
      req.user._id,
      content,
    );
    return res.status(status).json({ message, date });
  } catch (error) {
    return res.status(500).json({ message: error.message, data: error });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    if (!messageId) {
      return res.status(422).json({ message: "Message id is required" });
    }
    const { status, message, data } =
      await messageHelper.deleteMessage(messageId);
    return res.status(status).json({ message, data });
  } catch (error) {
    return res.status(500).json({ message: error.message, data: error });
  }
};
