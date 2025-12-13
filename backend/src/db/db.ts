import mongoose from "mongoose";

const mongoString =
  process.env.MONGODB || "mongodb://127.0.0.1:27017/airsquirePanorama";
  console.log('PROCESS ENV: ', process.env.MONGODB);

export const connectDB = async () => {
  await mongoose.connect(mongoString, {});

  const db = mongoose.connection;
  db.once("connected", () => console.log("Connected to MongoDB"));
  db.on("error", (e: Error) => console.error("Error connecting to MongoDB: ", e));
};
