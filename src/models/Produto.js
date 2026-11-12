import mongoose from "mongoose";

const produtoSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    descricao: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    preco: { type: Number, required: true, min: 0 },
    quantidade: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "quantidade deve ser inteira",
      },
    },
    ativo: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false },
);

export default mongoose.model("Produto", produtoSchema, "produtos");
