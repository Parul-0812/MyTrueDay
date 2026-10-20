
import mongoose from "mongoose";

async function connectDB() {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI || mongoURI.includes("your_actual_mongodb")) {
    throw new Error("Please configure MONGODB_URI in services/api/.env");
  }

  await mongoose.connect(mongoURI);

  console.log("MyTrueDay database connected successfully.");
}

export default connectDB;
