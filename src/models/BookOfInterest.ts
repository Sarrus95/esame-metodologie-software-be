import mongoose, { Schema, Document } from "mongoose";
import UserRef from "../interfaces/UserRef";

interface IBook extends Document {
    title: string;
    author: string;
    printYear: number;
    printCompany: string;
    userRef: UserRef;
}
const BookSchema = new Schema<IBook>({
  title: { type: String, required: true },
  printYear: { type: Number },
  printCompany: { type: String },
  userRef: {
    id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true }
  }
  
});
const Book = mongoose.model<IBook>("Book", BookSchema);
export default Book;
