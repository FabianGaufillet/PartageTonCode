import * as postHelper from "../helpers/postHelper.js";
import { defaultPostsByPage } from "../utils/constants.js";

export const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;
    const { status, message } = await postHelper.getPostById(postId);
    return res.status(status).json({ message });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(422).json({ message: "User id is required" });
    }
    const { page, limit } = req.query;
    const query = { profile: userId };
    const options = {
      page: page || 1,
      limit: limit || defaultPostsByPage,
      sort: { createdAt: -1 },
      populate: { path: "comments" },
    };
    const { status, message } = await postHelper.getAllPosts(query, options);
    return res.status(status).json({ message });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  try {
    Object.assign(req.body, { author: req.user._id });
    const { status, message, data } = await postHelper.createPost(req.body);
    return res.status(status).json({ message, data });
  } catch (error) {
    return res.status(500).json({ message: error.message, data: error });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { postId } = req.body;
    if (!postId) {
      return res.status(422).json({ message: "Post id is required" });
    }
    delete req.body.postId;
    const options = {};
    const { status, message, data } = await postHelper.updatePost(
      postId,
      req.body,
      options,
    );
    return res.status(status).json({ message, data });
  } catch (error) {
    return res.status(500).json({ message: error.message, data: error });
  }
};

export const removePost = async (req, res) => {
  try {
    const { postId } = req.params;
    if (!postId) {
      return res.status(422).json({ message: "Post id is required" });
    }
    const { status, message, data } = await postHelper.removePost(postId);
    return res.status(status).json({ message, data });
  } catch (error) {
    return res.status(500).json({ message: error.message, data: error });
  }
};

export const upvotePost = async (req, res) => {
  try {
    const { postId } = req.body;
    if (!postId) {
      return res.status(422).json({ message: "Post id is required" });
    }
    const post = await postHelper.getPostById(postId, {
      _id: 0,
      comments: 1,
      upvotes: 1,
    });
    if (200 !== post.status) {
      return res
        .status(post.status)
        .json({ message: post.message, data: post.data });
    }
    let upvotes = post.upvotes;
    const index = upvotes.indexOf(req.user._id);
    const options = {};
    if (index === -1) {
      upvotes.push(req.user._id);
    } else {
      upvotes.splice(index, 1);
    }
    const { status, message, data } = await postHelper.updatePost(
      postId,
      { upvotes },
      options,
    );
    return res.status(status).json({ message, data });
  } catch (error) {
    return res.status(500).json({ message: error.message, data: error });
  }
};
