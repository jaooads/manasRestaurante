import { Router } from "express";
import * as PedidoController from "./controllers/pedidoController";
import * as CaixaController from "./controllers/caixaController.js";

const router = Router();

// --------- PEDIDOS ---------
router.post("/pedido", PedidoController.criarPedido);
router.get("/pedidos", PedidoController.listarPedidos);

// --------- CAIXA ---------
router.post("/caixa/abrir", CaixaController.abrirCaixa);
router.post("/caixa/fechar", CaixaController.fecharCaixa);
router.get("/caixas", CaixaController.listarCaixas);

export default router;
