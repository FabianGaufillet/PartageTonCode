import mongoose from "mongoose";

const suggestionSchema = new mongoose.Schema({
  by: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: [],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: [],
  },
});

const relationshipSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    friends: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    pendings: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    ignored: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    suggested: {
      type: [suggestionSchema],
      default: [],
    },
  },
  { timestamps: true },
);

const Relationship = mongoose.model("relationships", relationshipSchema);
export default Relationship;
