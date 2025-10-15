import { Router } from "express";
import * as PedidoController from "./controllers/pedidoController";
import * as CaixaController from "./controllers/caixaController";
import * as ProdutoController from "./controllers/produtoController";

const router = Router();

// --------- PEDIDOS ---------
router.post("/pedido", PedidoController.criarPedido);
router.get("/pedidos", PedidoController.listarPedidos);
router.patch("/pedido/:pedidoId/status", PedidoController.atualizarStatusPedido);
router.patch("/pedido/:id/pagamento", PedidoController.registrarPagamento);
router.patch("/pedido/:id/pagamento", PedidoController.atualizarFormaPagamento);


// --------- CAIXA ---------
router.post("/caixa/abrir", CaixaController.abrirCaixa);
router.post("/caixa/fechar", CaixaController.fecharCaixa);
router.get("/caixas", CaixaController.listarCaixas);

// --------- PRODUTO ---------
router.post("/produto", ProdutoController.criarProduto);
router.get("/produtos", ProdutoController.listarProdutos);

export default router;
