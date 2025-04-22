import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
    email: string;
    password: string;
    emailAuthToken: string;
    emailVerified: boolean;
    loginAuthToken: string;
    username: string;
    phoneNo: string;
    booksOfInterest: Schema.Types.ObjectId[];
    myBooks: Schema.Types.ObjectId[];
    sentRequests: Schema.Types.ObjectId[];
    receivedRequests: Schema.Types.ObjectId[];
}
const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true,unique : true},
    password: { type: String, required: true},
    emailAuthToken: { type: String },
    emailVerified: { type: Boolean, default: false},
    loginAuthToken: { type: String },
    username: { type: String,unique: true},
    phoneNo: { type: String },
    booksOfInterest: [{ type: Schema.Types.ObjectId, ref: "BookOfInterest" }],
    myBooks: [{ type: Schema.Types.ObjectId, ref:"Book"}],
  },
);
const User = mongoose.model<IUser>("User", UserSchema);
export default User;