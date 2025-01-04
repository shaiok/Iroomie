import mongoose, { Schema, Document, Model } from "mongoose";

// 1. Define an interface for the User document
export interface IUser extends Document {
  email: string;
  password?: string;
  googleId?: string;
  fullName?: string;
  userType: "roommate" | "apartment" | "pending";
  picture?: string;
  profile?: mongoose.Types.ObjectId;
}

// 2. Create the User schema
const userSchema: Schema<IUser> = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v: string): boolean => {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: (props: { value: string }) =>
        `${props.value} is not a valid email address!`,
    },
  },
  password: { type: String },
  googleId: { type: String },
  fullName: { type: String },
  userType: {
    type: String,
    enum: ["roommate", "apartment", "pending"],
    required: true,
  },
  picture: { type: String },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "userType",
  },
});

// 3. Create and export the User model
const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
