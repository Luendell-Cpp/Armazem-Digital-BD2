export function validarProduto(req, res, next) {
  const b = req.body;
  const tipos = {
    nome: "string",
    descricao: "string",
    preco: "number",
    quantidade: "number",
    ativo: "boolean",
  };

  if (
    !b ||
    typeof b !== "object" ||
    Array.isArray(b) ||
    Object.keys(b).length === 0
  ) {
    return res.status(400).json({
      erro: "Envie um objeto JSON não vazio",
    });
  }

  for (const [campo, valor] of Object.entries(b)) {
    const permitido = Object.hasOwn(tipos, campo);
    const tipoCorreto = typeof valor === tipos[campo];
    const numeroInvalido = typeof valor === "number" && !Number.isFinite(valor);
    if (!permitido || !tipoCorreto || numeroInvalido) {
      return res.status(400).json({
        erro: "Campo ou tipo inválido: " + campo,
      });
    }
  }
  next();
}
