import mongoose, { Schema, Document } from "mongoose";

interface IBookOfInterest extends Document {
  title: string;
  author: string;
  printYear: number;
  printCompany: string;
  language: string;
  description: string;
  userRef: Schema.Types.ObjectId;
}
const BookOfInterestSchema = new Schema<IBookOfInterest>({
  title: { type: String, required: true },
  author: { type: String, required: true },
  printYear: { type: Number },
  printCompany: { type: String },
  language: { type: String, required: true },
  description: { type: String },
  userRef: { type: Schema.Types.ObjectId, ref: "User", required: true },
});
const BookOfInterest = mongoose.model<IBookOfInterest>(
  "BookOfInterest",
  BookOfInterestSchema
);
export default BookOfInterest;
