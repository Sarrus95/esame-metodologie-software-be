import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_DB || "");
    console.log(" MongoDB connesso!");
  } catch (error) {
    console.error(" Errore di connessione a MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;