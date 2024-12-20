import Post from "../models/Post.model.js";

export const getPostById = async (postId, projection = {}) => {
  try {
    const post = await Post.findById(postId, projection).populate("comments");
    if (!post) {
      return { status: 404, message: "Post not found", data: null };
    }
    return { status: 200, message: "Post found", data: post };
  } catch (error) {
    return { status: 500, message: error.message };
  }
};

export const getAllPosts = async (query, options) => {
  try {
    const posts = await Post.paginate(query, options);
    if (!posts.totalDocs) {
      return { status: 404, message: "No post found", data: posts };
    }
    return { status: 200, message: "Posts found", data: posts };
  } catch (error) {
    return { status: 500, message: error.message, data: error };
  }
};

export const createPost = async (post) => {
  try {
    const newPost = new Post(post);
    await newPost.save();
    return { status: 201, message: "Post created", data: newPost };
  } catch (error) {
    return { status: 500, message: error.message, data: error };
  }
};

export const updatePost = async (postId, update, options) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(postId, update, options);
    if (!updatedPost) {
      return { status: 404, message: "Post not found", data: null };
    }
    return { status: 204, message: "Post updated", data: updatedPost };
  } catch (error) {
    return { status: 500, message: error.message, data: error };
  }
};

export const removePost = async (postId) => {
  try {
    const removedPost = await Post.findByIdAndDelete(postId);
    if (!removedPost) {
      return { status: 404, message: "Post not found", data: null };
    }
    return { status: 204, message: "Post deleted", data: removedPost };
  } catch (error) {
    return { status: 500, message: error.message, data: error };
  }
};
