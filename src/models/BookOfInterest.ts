import mongoose, { Schema, Document } from "mongoose";

interface IBookOfInterest extends Document {
  title: string;
  author: string;
  printYear: number;
  printCompany: string;
  userRef: Schema.Types.ObjectId;
}
const BookOfInterestSchema = new Schema<IBookOfInterest>({
  title: { type: String, required: true },
  printYear: { type: Number },
  printCompany: { type: String },
  userRef: { type: Schema.Types.ObjectId, ref: "User", required: true },
});
const BookOfInterest = mongoose.model<IBookOfInterest>(
  "BookOfInteres",
  BookOfInterestSchema
);
export default BookOfInterest;
