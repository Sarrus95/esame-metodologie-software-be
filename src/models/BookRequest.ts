import mongoose, { Schema, Document } from "mongoose";

interface IBookRequest extends Document {
  userRef: Schema.Types.ObjectId;
  bookRef: Schema.Types.ObjectId;
  senderRef: Schema.Types.ObjectId;
  senderBook: Schema.Types.ObjectId;
  status: requests;
  phoneNo: String;
}
const BookRequestSchema = new Schema<IBookRequest>({
  userRef: { type: Schema.Types.ObjectId, ref: "User", required: true },
  bookRef: { type: Schema.Types.ObjectId, ref: "Book", required: true },
  senderRef: { type: Schema.Types.ObjectId, ref: "User", required: true },
  senderBook: { type: Schema.Types.ObjectId, ref: "Book", required: true },
  status: { type: String, default: "In Corso" },
  phoneNo: { type: String },
});

const BookRequest = mongoose.model<IBookRequest>(
  "BookRequest",
  BookRequestSchema
);
export default BookRequest;