import Comment from "../models/Comment.model.js";

export const getCommentById = async (commentId, projection = {}) => {
  try {
    const comment = await Comment.findById(commentId, projection);
    if (!comment) {
      return { status: 404, message: "Comment not found", data: null };
    }
    return { status: 200, message: "Comment found", data: comment };
  } catch (error) {
    return { status: 500, message: error.message, data: error };
  }
};

export const createComment = async (comment) => {
  try {
    const newComment = new Comment(comment);
    await newComment.save();
    return { status: 201, message: "Comment created", data: newComment };
  } catch (error) {
    return { status: 500, message: error.message, data: error };
  }
};

export const updateComment = async (commentId, update, options) => {
  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      update,
      options,
    );
    if (!updatedComment) {
      return { status: 404, message: "Comment not found", data: null };
    }
    return { status: 204, message: "Comment updated", data: updatedComment };
  } catch (error) {
    return { status: 500, message: error.message, data: error };
  }
};

export const removeComment = async (commentId) => {
  try {
    const removedComment = await Comment.findByIdAndDelete(commentId);
    if (!removedComment) {
      return { status: 404, message: "Comment not found", data: null };
    }
    return { status: 204, message: "Comment deleted", data: removedComment };
  } catch (error) {
    return { status: 500, message: error.message, data: error };
  }
};
