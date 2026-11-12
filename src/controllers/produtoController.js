import mongoose from "mongoose";
import Produto from "../models/Produto.js";

export async function criar(req, res) {
  const produto = await Produto.create(req.body);
  res.status(201).json(produto);
}

export async function listar(req, res) {
  const filtro = {};
  const { ativo, nome } = req.query;

  if (ativo !== undefined) {
    if (!["true", "false"].includes(ativo)) {
      return res.status(400).json({ erro: "ativo deve ser true ou false" });
    }
    filtro.ativo = ativo === "true";
  }

  if (nome !== undefined) {
    if (typeof nome !== "string") {
      return res.status(400).json({ erro: "nome deve ser texto" });
    }
    // Escapa caracteres especiais para a busca não virar uma regex arbitrária
    const seguro = nome.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filtro.nome = { $regex: seguro, $options: "i" };
  }

  const produtos = await Produto.find(filtro).sort({ createdAt: -1 });
  res.json(produtos);
}

export async function buscar(req, res) {
  const produto = await Produto.findById(req.params.id);
  if (!produto) {
    return res.status(404).json({ erro: "Produto não encontrado" });
  }
  res.json(produto);
}

export async function atualizar(req, res) {
  const produto = await Produto.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true },
  );
  if (!produto) {
    return res.status(404).json({ erro: "Produto não encontrado" });
  }
  res.json(produto);
}

export async function remover(req, res) {
  const produto = await Produto.findByIdAndDelete(req.params.id);
  if (!produto) {
    return res.status(404).json({ erro: "Produto não encontrado" });
  }
  res.status(204).send();
}

export function validarId(req, res, next) {
  if (!mongoose.isObjectIdOrHexString(req.params.id)) {
    return res.status(400).json({ erro: "ID inválido" });
  }
  next();
}
