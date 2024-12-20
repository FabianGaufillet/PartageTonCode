import * as commentHelper from "../helpers/commentHelper.js";

export const createComment = async (req, res) => {
  try {
    Object.assign(req.body, { author: req.user._id });
    const { status, message, data } = await commentHelper.createComment(
      req.body,
    );
    return res.status(status).json({ message, data });
  } catch (error) {
    return res.status(500).json({ message: error.message, data: error });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.body;
    if (!commentId) {
      return res.status(422).json({ message: "Comment id is required" });
    }
    delete req.body.commentId;
    const options = {};
    const { status, message, data } = await commentHelper.updateComment(
      commentId,
      req.body,
      options,
    );
    return res.status(status).json({ message, data });
  } catch (error) {
    return res.status(500).json({ message: error.message, data: error });
  }
};

export const removeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    if (!commentId) {
      return res.status(422).json({ message: "Comment id is required" });
    }
    const { status, message, data } =
      await commentHelper.removeComment(commentId);
    return res.status(status).json({ message, data });
  } catch (error) {
    return res.status(500).json({ message: error.message, data: error });
  }
};

export const upvoteComment = async (req, res) => {
  try {
    const { commentId } = req.body;
    if (!commentId) {
      return res.status(422).json({ message: "Comment id is required" });
    }
    const comment = await commentHelper.getCommentById(commentId, {
      upvotes: 1,
    });
    if (200 !== comment.status) {
      return res
        .status(comment.status)
        .json({ message: comment.message, data: comment.data });
    }
    const index = comment.upvotes.indexOf(req.user._id);
    const options = {};
    let upvotes = comment.upvotes;
    if (index === -1) {
      upvotes.push(req.user._id);
    } else {
      upvotes.splice(index, 1);
    }
    const { status, message, data } = await commentHelper.updateComment(
      commentId,
      { upvotes },
      options,
    );
    return res.status(status).json({ message, data });
  } catch (error) {
    return res.status(500).json({ message: error.message, data: error });
  }
};
