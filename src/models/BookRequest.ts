import mongoose, { Schema, Document } from "mongoose";

interface IBookRequest extends Document {
  userRef: Schema.Types.ObjectId;
  bookRef: Schema.Types.ObjectId;
  proposedBook: Schema.Types.ObjectId;
  status: requests;
}
const BookRequestSchema = new Schema<IBookRequest>({
  userRef: { type: Schema.Types.ObjectId, ref: "User", required: true },
  bookRef: { type: Schema.Types.ObjectId, ref: "Book", required: true },
  proposedBook: { type: Schema.Types.ObjectId, ref: "Book", required: true },
  status: { type: String, default: "In Corso" },
});

const BookRequest = mongoose.model<IBookRequest>(
  "BookRequest",
  BookRequestSchema
);
export default BookRequest;