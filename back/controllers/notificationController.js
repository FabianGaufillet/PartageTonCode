import * as notificationHelper from "../helpers/notificationHelper.js";

export const getNotifications = async (req, res) => {
  try {
    const { status, message, data } = await notificationHelper.getNotifications(
      req.user._id,
    );
    return res.status(status).json({ message, data });
  } catch (error) {
    return res.status(500).json({ message: error.message, data: error });
  }
};

export const createNotification = async (req, res) => {
  try {
    const { form } = req.body;
    const { status, message, data } =
      await notificationHelper.createNotification(form);
    return res.status(status).json({ message, data });
  } catch (error) {
    return res.status(500).json({ message: error.message, data: error });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { status, message, data } =
      await notificationHelper.markNotificationAsRead(notificationId);
    return res.status(status).json({ message, data });
  } catch (error) {
    return res.status(500).json({ message: error.message, data: error });
  }
};

export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const { status, message, data } =
      await notificationHelper.markAllNotificationsAsRead(req.user._id);
    return res.status(status).json({ message, data });
  } catch (error) {
    return res.status(500).json({ message: error.message, data: error });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { status, message, data } =
      await notificationHelper.deleteNotification(notificationId);
    return res.status(status).json({ message, data });
  } catch (error) {
    return res.status(500).json({ message: error.message, data: error });
  }
};

export const deleteAllNotifications = async (req, res) => {
  try {
    const { status, message, data } =
      await notificationHelper.deleteAllNotifications(req.user._id);
    return res.status(status).json({ message, data });
  } catch (error) {
    return res.status(500).json({ message: error.message, data: error });
  }
};
