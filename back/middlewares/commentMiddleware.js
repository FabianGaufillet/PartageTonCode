import Comment from "../models/Comment.model.js";

export const isCommentOwnerOrAdmin = async (req, res, next) => {
  try {
    const commentId = req.body?.commentId || req.params?.commentId;
    if (!commentId) {
      return res
        .status(422)
        .json({ message: "Comment id is required", data: null });
    }
    if ("admin" === req.user.role) {
      return next();
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return next({ status: 404, message: "Comment not found", data: null });
    }
    if (comment.author !== req.user._id) {
      return next({
        status: 403,
        message: "You are not allowed to edit this comment",
        data: null,
      });
    }
    return next();
  } catch (error) {
    return next({ status: 500, message: error.message, data: error });
  }
};
