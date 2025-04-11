import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    emailAuthToken: string;
    emailVerified: boolean;
    loginAuthToken: string;
    phoneNo: string;
    booksOfInterest: Schema.Types.ObjectId[];
    myBooks: Schema.Types.ObjectId[];
}
const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true,unique: true},
    email: { type: String, required: true,unique : true},
    password: { type: String, required: true},
    emailAuthToken: { type: String },
    emailVerified: { type: Boolean, default: false},
    loginAuthToken: { type: String },
    phoneNo: { type: String },
    booksOfInterest: [{ type: Schema.Types.ObjectId, ref: "BookOfInterest" }],
    myBooks: [{ type: Schema.Types.ObjectId, ref:"Book"}],
  },
);
const User = mongoose.model<IUser>("User", UserSchema);
export default User;