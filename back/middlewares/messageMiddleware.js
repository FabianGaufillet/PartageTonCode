import Message from "../models/Message.model.js";

export const isMessageOwnerOrAdmin = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    if (!messageId) {
      return next({
        status: 422,
        message: "Message id is required",
        data: null,
      });
    }
    if ("admin" === req.user.role) {
      return next();
    }
    const message = await Message.findById(messageId);
    if (message.author !== req.user._id) {
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
