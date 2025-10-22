import { Request, Response } from "express";
import { Pedido } from "../models/pedido";
import { ItemPedido } from "../models/itemPedido";
import { Cliente } from "../models/cliente";
import { Caixa } from "../models/caixa";
import { Produto } from "../models/produto";

export const criarPedido = async (req: Request, res: Response) => {
    try {

        const caixaAberto = await Caixa.findOne({ where: { status: "aberto" } });
        if (!caixaAberto) {
            return res.status(400).json({ msg: "Não é possível criar pedido. Abra o caixa primeiro." });
        }
        const { clienteNome, itens } = req.body;

        if (!clienteNome || !itens || itens.length === 0) {
            return res.status(400).json({ msg: "Cliente e itens são obrigatórios" });
        }

        // Criar ou buscar cliente
        let cliente = await Cliente.findOne({ where: { nome: clienteNome } });
        if (!cliente) cliente = await Cliente.create({ nome: clienteNome });

        // Calcular total
        const total = itens.reduce((acc: number, item: any) => acc + item.quantidade * item.precoUnitario, 0);

        // Criar pedido
        const pedido = await Pedido.create({ clienteId: cliente.id, total, status: "em_preparo" });

        // Criar itens
        const itensCriados = await Promise.all(itens.map(item =>
            ItemPedido.create({
                pedidoId: pedido.id,
                descricao: item.descricao,
                quantidade: item.quantidade,
                precoUnitario: item.precoUnitario,
                produtoId: item.produtoId,
            })
        ));

        const pedidoCompleto = await Pedido.findOne({
            where: { id: pedido.id },
            include: [
                { model: Cliente, attributes: ["nome"] },
                { model: ItemPedido, as: "itens" },
            ],
        });

        return res.status(201).json({ msg: "Pedido criado com sucesso", pedido: pedidoCompleto });
    } catch (error) {

        console.error(error);
        return res.status(500).json({ msg: "Erro ao criar pedido", error });
    }
};

export const listarPedidos = async (_req: Request, res: Response) => {
    try {
        const pedidos = await Pedido.findAll({
            include: [
                { model: Cliente, attributes: ["nome"] },
                { model: ItemPedido, as: "itens" },
            ],
            order: [["data", "DESC"]],
        });
        return res.json(pedidos);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Erro ao listar pedidos", error });
    }
};

export const atualizarStatusPedido = async (req: Request, res: Response) => {
    try {
        const { pedidoId } = req.params;
        const { status } = req.body;

        if (!["em_preparo", "concluido", "pago"].includes(status)) {
            return res.status(400).json({ msg: "Status inválido" });
        }

        const pedido = await Pedido.findByPk(pedidoId);
        if (!pedido) return res.status(404).json({ msg: "Pedido não encontrado" });

        pedido.status = status as "em_preparo" | "concluido" | "pago";
        await pedido.save();

        return res.json({ msg: "Status atualizado com sucesso", pedido });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Erro ao atualizar status", error });
    }
};

export const registrarPagamento = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { formaPagamento } = req.body;

        const pedido = await Pedido.findByPk(id);
        if (!pedido) return res.status(404).json({ msg: "Pedido não encontrado" });

        pedido.status = "pago";
        pedido.formaPagamento = formaPagamento;
        await pedido.save();

        return res.json({ msg: "Pagamento registrado com sucesso" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Erro ao registrar pagamento" });
    }
};

export const atualizarFormaPagamento = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { formaPagamento } = req.body;

        const pedido = await Pedido.findByPk(id);
        if (!pedido) return res.status(404).json({ msg: "Pedido não encontrado" });

        pedido.formaPagamento = formaPagamento;
        await pedido.save();

        return res.json({ msg: "Forma de pagamento atualizada com sucesso" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Erro ao atualizar forma de pagamento" });
    }
};

export const adicionarItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { produtoId, quantidade } = req.body;

        const pedido = await Pedido.findByPk(id);
        if (!pedido) return res.status(404).json({ msg: "Pedido não encontrado" });

        const produto = await Produto.findByPk(produtoId);
        if (!produto) return res.status(404).json({ msg: "Produto não encontrado" });

        await ItemPedido.create({
            pedidoId: pedido.id,
            produtoId: produto.id,
            descricao: produto.nome,
            quantidade,
            precoUnitario: produto.preco
        });

        const itens = await ItemPedido.findAll({ where: { pedidoId: pedido.id } });
        const totalAtualizado = itens.reduce(
            (acc, item) => acc + item.precoUnitario * item.quantidade,
            0
        );

        await pedido.update({ total: totalAtualizado });

        return res.json({ msg: "Item adicionado ao pedido", totalAtualizado });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Erro ao adicionar item" });
    }
};

export const removerItem = async (req: Request, res: Response) => {
    try {
        const { pedidoId, itemId } = req.params;
        const item = await ItemPedido.findOne({ where: { id: itemId, pedidoId } });
        if (!item) return res.status(404).json({ msg: "Item não encontrado" });

        await item.destroy();

        const itensRestantes = await ItemPedido.findAll({ where: { pedidoId } });
        const totalAtualizado = itensRestantes.reduce(
            (acc, i) => acc + i.precoUnitario * i.quantidade,
            0
        );

        await Pedido.update({ total: totalAtualizado }, { where: { id: pedidoId } });

        return res.json({ msg: "Item removido com sucesso", totalAtualizado });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Erro ao remover item" });
    }
};

export const buscarPedidoPorId = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const pedido = await Pedido.findByPk(id, {
            include: [
                { model: ItemPedido, as: "itens" },
                { model: Cliente, attributes: ["nome"] }
            ]
        });

        if (!pedido) return res.status(404).json({ msg: "Pedido não encontrado" });

        return res.json(pedido);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Erro ao buscar pedido" });
    }

};



