import { Router } from "express";
import * as PedidoController from "./controllers/pedidoController";
import * as CaixaController from "./controllers/caixaController";
import * as ProdutoController from "./controllers/produtoController";
import * as historicoCaixaController from "./controllers/historioCaixaController";
import * as relatorioController from "./controllers/relatorioController";
const router = Router();

// --------- PEDIDOS ---------
router.post("/pedido", PedidoController.criarPedido);
router.get("/pedidos", PedidoController.listarPedidos);
router.patch("/pedido/:pedidoId/status", PedidoController.atualizarStatusPedido);
router.patch("/pedido/:id/pagamento", PedidoController.registrarPagamento);
router.patch("/pedido/:id/pagamento", PedidoController.atualizarFormaPagamento);
router.post("/pedidos/:id/adicionarItens", PedidoController.adicionarItem);
router.get("/pedidos/:id", PedidoController.buscarPedidoPorId);
router.delete("/pedidos/:pedidoId/removerItem/:itemId", PedidoController.removerItem);


// --------- CAIXA ---------
router.post("/caixa/abrir", CaixaController.abrirCaixa);
router.post("/caixa/fechar", CaixaController.fecharCaixa);
router.get("/caixas", CaixaController.listarCaixas);
router.get("/caixaVendas", CaixaController.caixaVendas);

// --------- PRODUTO ---------
router.post("/produto", ProdutoController.criarProduto);
router.get("/produtos", ProdutoController.listarProdutos);

// --------- HISTORICO CAIXA ---------
router.get("/caixa/historico", historicoCaixaController.historicoCaixa);

// --------- RELATORIO ---------

router.post("/relatorios/gerar", relatorioController.gerarRelatorio);
router.get("/relatorios", relatorioController.listarRelatorios);


export default router;
