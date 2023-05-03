import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    coins:{
        type:Number,
        default:0
    },
    location:{
        type:String
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);