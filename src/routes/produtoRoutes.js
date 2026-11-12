import { Router } from "express";
import * as c from "../controllers/produtoController.js";
import { validarProduto } from "../middlewares/validarProduto.js";

const router = Router();

router.get("/", c.listar);
router.post("/", validarProduto, c.criar);
router.get("/:id", c.validarId, c.buscar);
router.patch("/:id", c.validarId, validarProduto, c.atualizar);
router.delete("/:id", c.validarId, c.remover);

export default router;
