import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: function(v: string) {
          return /^\d{4}$/.test(v);
        },
        message: 'User ID must be exactly 4 digits'
      }
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    matchedUserId: {
      type: String,
      default: null,
      trim: true,
      validate: {
        validator: function(v: string | null) {
          return v === null || /^\d{4}$/.test(v);
        },
        message: 'Matched User ID must be exactly 4 digits'
      }
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
