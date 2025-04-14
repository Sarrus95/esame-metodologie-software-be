import mongoose, { Schema, Document } from "mongoose";

interface IRequest extends Document {
    userRef: Schema.Types.ObjectId;
    bookRef: Schema.Types.ObjectId;
}
const RequestSchema = new Schema<IRequest>({
  userRef: { type: Schema.Types.ObjectId, ref: "User", required: true },
  bookRef: { type: Schema.Types.ObjectId,ref: "Book",required: true}
});
const Request = mongoose.model<IRequest>("Request", RequestSchema);
export default Request;