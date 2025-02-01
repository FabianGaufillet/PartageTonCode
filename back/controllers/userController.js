import passport from "../config/passport.js";
import * as userHelper from "../helpers/userHelper.js";
import * as sendHelper from "../helpers/sendHelper.js";
import { MAILBOX_USER } from "../config/env.js";

export const userStatus = async (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(200).json({
      message: "User is authenticated",
      data: {
        authenticated: true,
        isAdmin: "admin" === req.user.role,
        _id: req.user._id,
      },
    });
  }
  return res.status(200).json({
    message: "User is not authenticated",
    data: { authenticated: false, isAdmin: false, _id: null },
  });
};

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, message, data } = await userHelper.getUserById(userId);
    return res.status(status).json({ message, data });
  } catch (error) {
    return res.status(500).json({ message: error.message, data: error });
  }
};

export const getAllPotentialFriends = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const match = search ? { username: new RegExp(search, "i") } : null;
    const options = {
      page: page || 1,
      limit: limit || 10,
      sort: { username: 1 },
    };
    const { status, message, data } = await userHelper.getAllPotentialFriends(
      req.user,
      match,
      options,
    );
    return res.status(status).json({ message, data });
  } catch (error) {
    return res.status(500).json({ message: error.message, data: error });
  }
};

export const signup = async (req, res) => {
  try {
    const { password } = req.body;
    delete req.body.password;
    const { status, message, data } = await userHelper.signup(
      req.body,
      password,
    );
    return res.status(status).json({ message, data });
  } catch (error) {
    return res.status(500).json({ message: error.message, data: error });
  }
};

export const signin = async (req, res) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: err.message, data: err });
    }
    if (!user) {
      return res.status(401).json({ message: info.message, data: info });
    }
    req.login(user, (error) => {
      if (error) {
        return res.status(500).json({ message: error.message, data: error });
      }
      return res
        .status(200)
        .json({ message: "Authentication successful!", data: user });
    });
  })(req, res);
};

export const signout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(400).json({
        message: "Error while logging out",
        data: err,
      });
    }
    return res.status(205).json({
      message: "Successfully logged out",
      data: null,
    });
  });
};

export const updateUser = async (req, res) => {
  try {
    const form = req.body;
    const userId = req.params["userId"];
    const options = { runValidators: true, new: true };
    const { status, message, data } = await userHelper.updateUser(
      userId,
      form,
      options,
    );
    if (form.username && 204 === status) {
      req.user.username = form.username;
      req.login(req.user, (error) => {
        if (error) {
          return res.status(500).json({ message: error.message, data: error });
        }
        return res.status(204).json({ message, data });
      });
    } else {
      return res.status(status).json({ message, data });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message, data: error });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, password } = req.body;
    const { status, message, data } = await userHelper.changePassword(
      req.user._id,
      oldPassword,
      password,
    );
    return res.status(status).json({ message, data });
  } catch (error) {
    return res.status(500).json({ message: error.message, data: error });
  }
};

export const changeRole = async (req, res) => {
  try {
    const { userId, role } = req.body;
    const options = { runValidators: true, new: true };
    const { status, message, data } = await userHelper.changeRole(
      userId,
      role,
      options,
    );
    return res.status(status).json({ message, data });
  } catch (error) {
    return res.status(500).json({ message: error.message, data: error });
  }
};

export const checkPassword = async (req, res) => {
  try {
    const id = req.user._id;
    const { password } = req.body;
    const { status, message, data } = await userHelper.checkPassword(
      id,
      password,
    );
    return res.status(status).json({ message, data });
  } catch (error) {
    return res.status(500).json({ message: error.message, data: error });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const { status, message, data } = await userHelper.resetPassword(email);
    let info = null;
    if (status === 200) {
      info = await sendHelper.sendEmail({
        from: MAILBOX_USER,
        to: email,
        subject: "Partage ton code - Réinitialisation de votre mot de passe",
        text: `Votre nouveau mot de passe est : ${data}. Pensez à le changer dans votre profil.`,
      });
    }
    return res.status(status).json({ message, data: info });
  } catch (error) {
    return res.status(500).json({ message: error.message, data: error });
  }
};

export const removeUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (req.user._id.toString() === userId) {
      req.logout((err) => {
        if (err) {
          return res.status(400).json({
            message: "Error while logging out",
            data: err,
          });
        }
      });
    }
    const { status, message, data } = await userHelper.removeUser(userId);
    return res.status(status).json({
      message,
      data,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, data: error });
  }
};
