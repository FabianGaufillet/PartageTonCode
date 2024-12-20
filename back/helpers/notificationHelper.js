import Notification from "../models/Notification.model.js";

export const getNotifications = async (userId) => {
  try {
    const notifications = await Notification.find({ userId });
    if (!notifications) {
      return { status: 404, message: "Notifications not found", data: null };
    }
    return { status: 200, message: "Notifications found", data: notifications };
  } catch (error) {
    return { status: 500, message: error.message, data: error };
  }
};

export const createNotification = async (form) => {
  try {
    const notification = await Notification.create(form);
    return { status: 201, message: "Notification created", data: notification };
  } catch (error) {
    return { status: 500, message: error.message, data: error };
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true },
    );
    if (!notification) {
      return { status: 404, message: "Notification not found", data: null };
    }
    return { status: 204, message: "Notification updated", data: notification };
  } catch (error) {
    return { status: 500, message: error.message, data: error };
  }
};

export const markAllNotificationsAsRead = async (userId) => {
  try {
    const notifications = await Notification.updateMany(
      { userId },
      { isRead: true },
    );
    return {
      status: 204,
      message: "All notifications updated",
      data: notifications,
    };
  } catch (error) {
    return { status: 500, message: error.message, data: error };
  }
};

export const deleteNotification = async (notificationId) => {
  try {
    const notification = await Notification.findByIdAndDelete(notificationId);
    if (!notification) {
      return { status: 404, message: "Notification not found", data: null };
    }
    return { status: 204, message: "Notification deleted", data: notification };
  } catch (error) {
    return { status: 500, message: error.message, data: error };
  }
};

export const deleteAllNotifications = async (userId) => {
  try {
    const notifications = await Notification.deleteMany({ userId });
    return {
      status: 204,
      message: "All notifications deleted",
      data: notifications,
    };
  } catch (error) {
    return { status: 500, message: error.message, data: error };
  }
};
