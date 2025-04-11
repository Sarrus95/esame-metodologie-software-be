import mongoose, { Schema, Document } from "mongoose";

interface IBook extends Document {
    title: string;
    author: string;
    printYear: number;
    printCompany: string;
    userRef: Schema.Types.ObjectId;
}
const BookSchema = new Schema<IBook>({
  title: { type: String, required: true },
  printYear: { type: Number },
  printCompany: { type: String },
  userRef: { type: Schema.Types.ObjectId, ref: "User", required: true }
  
});
const BookOfInterest = mongoose.model<IBook>("Book", BookSchema);
export default BookOfInterest;