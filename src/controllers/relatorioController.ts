import { Request, Response } from "express";
import { Pedido } from "../models/pedido.js";
import { Relatorio } from "../models/relatorio.js";

export const gerarRelatorio = async (req: Request, res: Response) => {
    try {
        const { tipo, periodo } = req.body;

        const pedidos = await Pedido.findAll({ where: { status: "pago" } });

        let dados: any = {};

        switch (tipo) {
            case "vendas_diarias":
                pedidos.forEach(p => {
                    const dia = new Date(p.data).toISOString().slice(0, 10);
                    dados[dia] = (dados[dia] || 0) + p.total;
                });
                break;

            case "vendas_semanais":
                pedidos.forEach(p => {
                    const data = new Date(p.data);
                    const ano = data.getFullYear();
                    const semana = Math.ceil((((data.getTime() - new Date(ano, 0, 1).getTime()) / 86400000) + new Date(ano, 0, 1).getDay() + 1) / 7);
                    const chave = `${ano}-W${semana}`;
                    dados[chave] = (dados[chave] || 0) + p.total;
                });
                break;

            case "vendas_mensais":
                pedidos.forEach(p => {
                    const mes = new Date(p.data).toISOString().slice(0, 7);
                    dados[mes] = (dados[mes] || 0) + p.total;
                });
                break;

            case "produtos_mais_vendidos":
                pedidos.forEach(p => {
                    p.itens?.forEach(i => {
                        dados[i.descricao] = (dados[i.descricao] || 0) + i.quantidade;
                    });
                });
                break;

            case "total_por_forma_pagamento":
                pedidos.forEach(p => {
                    const f = p.formaPagamento || "OUTROS";
                    dados[f] = (dados[f] || 0) + p.total;
                });
                break;

            case "clientes_mais_frequentes":
                pedidos.forEach(p => {
                    const c = p.Cliente?.nome || "DESCONHECIDO";
                    dados[c] = (dados[c] || 0) + 1;
                });
                break;

            default:
                return res.status(400).json({ msg: "Tipo de relatório inválido" });
        }

        const relatorio = await Relatorio.create({
            tipo,
            periodo: periodo || new Date().toISOString().slice(0, 10),
            dados: JSON.stringify(dados)
        });

        return res.status(201).json({ msg: "Relatório gerado", relatorio });

    } catch (error) {
        console.error("Erro ao gerar relatório:", error);
        return res.status(500).json({ msg: "Erro ao gerar relatório" });
    }
};

export const listarRelatorios = async (_req: Request, res: Response) => {
    try {
        const relatorios = await Relatorio.findAll({ order: [["dataGeracao", "DESC"]] });
        return res.json(relatorios);
    } catch (error) {
        console.log("Erro ao listar relatórios:", error);
        return res.status(500).json({ msg: "Erro ao listar relatórios" });
    }
};
