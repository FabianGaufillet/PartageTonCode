import * as channelHelper from "../helpers/channelHelper.js";

export const getChannels = async (req, res) => {
  try {
    const { status, message, data } = await channelHelper.getChannels(
      req.user._id,
    );
    return res.status(status).json({ message, data });
  } catch (error) {
    return res.status(500).json({ message: error.message, data: error });
  }
};

export const createChannel = async (req, res) => {
  try {
    const { form } = req.body;
    const { status, message, data } = await channelHelper.createChannel(form);
    return res.status(status).json({ message, data });
  } catch (error) {
    return res.status(500).json({ message: error.message, data: error });
  }
};

export const deleteChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const { status, message, data } =
      await channelHelper.deleteChannel(channelId);
    return res.status(status).json({ message, data });
  } catch (error) {
    return res.status(500).json({ message: error.message, data: error });
  }
};
