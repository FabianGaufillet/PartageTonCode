import Channel from "../models/Channel.model.js";

export const getChannels = async (openerId) => {
  try {
    const channels = await Channel.find({
      $or: [{ opener: openerId }, { participants: openerId }],
    });
    if (!channels) {
      return { status: 404, message: "Channels not found", data: null };
    }
    return { status: 200, message: "Channels found", data: channels };
  } catch (error) {
    return { status: 500, message: error.message, data: error };
  }
};

export const createChannel = async (form) => {
  try {
    const channel = await Channel.create(form);
    return { status: 201, message: "Channel created", data: channel };
  } catch (error) {
    return { status: 500, message: error.message, data: error };
  }
};

export const deleteChannel = async (channelId) => {
  try {
    const channel = await Channel.findByIdAndDelete(channelId);
    if (!channel) {
      return { status: 404, message: "Channel not found", data: null };
    }
    return { status: 200, message: "Channel deleted", data: channel };
  } catch (error) {
    return { status: 500, message: error.message, data: error };
  }
};
