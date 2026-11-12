import mongoose from "mongoose";

export async function conectarDB() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI nao definida");
  }
  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  });
  console.log("MongoDB conectado");
}
