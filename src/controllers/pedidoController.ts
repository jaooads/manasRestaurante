import { Request, Response } from "express";
import { Pedido } from "../models/pedido";
import { ItemPedido } from "../models/itemPedido";
import { Cliente } from "../models/cliente";

export const criarPedido = async (req: Request, res: Response) => {
    try {
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
        for (const item of itens) {
            await ItemPedido.create({
                pedidoId: pedido.id,
                descricao: item.descricao,
                quantidade: item.quantidade,
                precoUnitario: item.precoUnitario,
            });
        }

        return res.status(201).json({ msg: "Pedido criado com sucesso", pedidoId: pedido.id });
    } catch (error) {
        
        console.error(error);
        return res.status(500).json({ msg: "Erro ao criar pedido" , error});
    }
};

export const listarPedidos = async (_req: Request, res: Response) => {
    try {
        const pedidos = await Pedido.findAll({
            include: [
                { model: Cliente, attributes: ["nome"] },
                { model: ItemPedido },
            ],
            order: [["data", "DESC"]],
        });
        return res.json(pedidos);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Erro ao listar pedidos" });
    }
};
