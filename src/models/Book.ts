import mongoose, { Schema, Document } from "mongoose";

interface IBook extends Document {
  title: string;
  author: string;
  coverImg: string;
  printYear: number;
  printCompany: string;
  condition: grading;
  description: string;
  status: status;
  submitDate: Date;
  ownerId: Schema.Types.ObjectId;
}
const BookSchema = new Schema<IBook>({
  title: { type: String, required: true },
  author: { type: String, required: true },
  coverImg: { type: String, default: "" },
  printYear: { type: Number, required: true },
  printCompany: { type: String, required: true },
  condition: { type: String, required: true },
  description: { type: String, default: "" },
  status: { type: String, default: "In Vendita" },
  submitDate: { type: Date, default: () => new Date() },
  ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});
const Book = mongoose.model<IBook>("Book", BookSchema);
export default Book;