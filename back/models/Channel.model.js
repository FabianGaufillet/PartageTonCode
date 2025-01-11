import mongoose from "mongoose";

const channelSchema = new mongoose.Schema(
  {
    opener: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "Opener is required"],
    },
    members: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "users",
      default: [],
    },
  },
  { timestamps: true },
);

const Channel = mongoose.model("channels", channelSchema);
export default Channel;
