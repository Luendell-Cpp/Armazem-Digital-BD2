export function tratarErros(erro, req, res, next) {
  if (erro.type === "entity.parse.failed") {
    return res.status(400).json({ erro: "JSON inválido" });
  }
  if (["ValidationError", "CastError"].includes(erro.name)) {
    return res.status(400).json({
      erro: "Dados inválidos",
      detalhes: erro.message,
    });
  }
  if (erro.type === "entity.too.large") {
    return res.status(413).json({
      erro: "JSON excede o limite de 100 KB",
    });
  }
  console.error(erro);
  res.status(500).json({ erro: "Erro interno do servidor" });
}
