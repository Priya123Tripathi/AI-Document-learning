import mongoose from "mongoose";

//   Connect to MongoDB using Mongoose


const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    console.error("MONGO_URI not found in environment variables.");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoURI);
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  }
  
  mongoose.connection.on("error", (err) => {
    console.error(" MongoDB Error:", err.message);
  });
};

export default connectDB;
