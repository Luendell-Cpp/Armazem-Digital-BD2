import "dotenv/config";
import express from "express";
import { conectarDB } from "./config/db.js";
import produtoRoutes from "./routes/produtoRoutes.js";
import { tratarErros } from "./middlewares/erros.js";

const app = express();
app.use(express.json({ limit: "100kb" }));

app.get("/saude", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/produtos", produtoRoutes);

app.use((req, res) => {
  res.status(404).json({ erro: "Rota não encontrada" });
});
app.use(tratarErros);

try {
  await conectarDB();
  const porta = Number(process.env.PORT || 3000);
  app.listen(porta, "127.0.0.1", () => {
    console.log("API na porta " + porta);
  });
} catch (erro) {
  console.error("Falha ao iniciar:", erro.message);
  process.exit(1);
}
