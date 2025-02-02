import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const suggestionSchema = new mongoose.Schema({
  by: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "users",
    default: [],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    default: [],
  },
});

const relationshipSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    friends: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "users",
      default: [],
    },
    pendings: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "users",
      default: [],
    },
    ignored: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "users",
      default: [],
    },
    suggested: {
      type: [suggestionSchema],
      default: [],
    },
  },
  { timestamps: true },
);

relationshipSchema.plugin(mongoosePaginate);
relationshipSchema.plugin(mongooseAggregatePaginate);

const Relationship = mongoose.model("relationships", relationshipSchema);
export default Relationship;
