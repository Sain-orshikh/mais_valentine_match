import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    valentineId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: function(v: string) {
          return /^\d{4}$/.test(v);
        },
        message: 'Valentine ID must be exactly 4 digits'
      }
    },
    matchedId: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function(v: string) {
          return /^\d{4}$/.test(v);
        },
        message: 'Matched ID must be exactly 4 digits'
      }
    },
    matchedName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Match || mongoose.model("Match", matchSchema);
