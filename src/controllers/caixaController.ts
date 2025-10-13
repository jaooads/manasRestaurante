import { Request, Response } from "express";
import { Caixa } from "../models/caixa.js";
import { Pedido } from "../models/pedido.js";

export const abrirCaixa = async (_req: Request, res: Response) => {
    try {
        const caixaAberto = await Caixa.findOne({ where: { status: "aberto" } });
        if (caixaAberto) return res.status(400).json({ msg: "Já existe um caixa aberto" });

        const caixa = await Caixa.create({ status: "aberto" });
        return res.status(201).json({ msg: "Caixa aberto com sucesso", caixaId: caixa.id });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Erro ao abrir caixa" });
    }
};

export const fecharCaixa = async (_req: Request, res: Response) => {
    try {
        const caixa = await Caixa.findOne({ where: { status: "aberto" } });
        if (!caixa) return res.status(400).json({ msg: "Não há caixa aberto" });

        const pedidos = await Pedido.findAll({ where: { caixaId: caixa.id, status: "pago" } });
        const totalVendido = pedidos.reduce((acc, pedido) => acc + pedido.total, 0);

        caixa.totalVendido = totalVendido;
        caixa.status = "fechado";
        caixa.dataFechamento = new Date();
        await caixa.save();

        return res.json({ msg: "Caixa fechado", totalVendido });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Erro ao fechar caixa" });
    }
};

export const listarCaixas = async (_req: Request, res: Response) => {
    try {
        const caixas = await Caixa.findAll({ order: [["dataAbertura", "DESC"]] });
        return res.json(caixas);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Erro ao listar caixas" });
    }
};
