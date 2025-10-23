import { Request, Response } from "express";
import { Caixa } from "../models/caixa.js";
import { Pedido } from "../models/pedido.js";
import { ItemPedido } from "../models/itemPedido.js";
import { Op } from "sequelize";


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

        // Buscar pedidos pagos que ainda não foram associados a nenhum caixa
        const pedidos = await Pedido.findAll({
            where: {
                status: "pago",
                caixaId: { [Op.is]: null } as any
            }
        });


        // Atualizar caixaId nos pedidos
        await Promise.all(
            pedidos.map(p => {
                p.caixaId = caixa.id;
                return p.save();
            })
        );

        const todosPedidosDoCaixa = await Pedido.findAll({ where: { caixaId: caixa.id, status: "pago" } });
        const totalVendido = todosPedidosDoCaixa.reduce((acc, pedido) => acc + pedido.total, 0);

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

export const caixaVendas = async (_req: Request, res: Response) => {
    try {
        const vendas = await Pedido.findAll({
            include: [{ model: ItemPedido, as: "itens" }]
        });

        type ResumoItem = { quantidade: number; valor: number };
        const resumo: Record<string, Record<string, ResumoItem>> = {
            dia: {},
            semana: {},
            mes: {}
        };

        const hoje = new Date();
        const inicioSemana = new Date(hoje);
        inicioSemana.setDate(hoje.getDate() - hoje.getDay()); // domingo
        const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

        const somarItem = (map: Record<string, ResumoItem>, nome: string, qtd: number, valor: number) => {
            if (!map[nome]) map[nome] = { quantidade: 0, valor: 0 };
            map[nome].quantidade += qtd;
            map[nome].valor += valor;
        };

        vendas.forEach(pedido => {
            const dataPedido = new Date(pedido.data);
            pedido.itens?.forEach(item => {
                const { descricao, quantidade, precoUnitario } = item;
                const valorTotal = quantidade * precoUnitario;

                if (dataPedido.toDateString() === hoje.toDateString()) {
                    somarItem(resumo.dia, descricao, quantidade, valorTotal);
                }
                if (dataPedido >= inicioSemana) {
                    somarItem(resumo.semana, descricao, quantidade, valorTotal);
                }
                if (dataPedido >= inicioMes) {
                    somarItem(resumo.mes, descricao, quantidade, valorTotal);
                }
            });
        });

        res.json(resumo);
    } catch (error) {
        console.error("Erro caixaVendas:", error);
        res.status(400).json({ error: "Erro ao carregar vendas" });
    }
};


