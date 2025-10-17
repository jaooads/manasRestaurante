import { Request, Response } from "express";
import { Caixa } from "../models/caixa";
import { Pedido } from "../models/pedido";
import { Cliente } from "../models/cliente";
import { ItemPedido } from "../models/itemPedido";


export const historicoCaixa = async (_req: Request, res: Response) => {
    try {
        const caixas = await Caixa.findAll({ order: [["dataAbertura", "DESC"]] });

        const resultado = await Promise.all(
            caixas.map(async (caixa) => {
                const pedidos = await Pedido.findAll({
                    where: { caixaId: caixa.id, status: "pago" },
                    include: [
                        { model: Cliente, attributes: ["nome"] },
                        { model: ItemPedido, as: "itens", attributes: ["descricao", "quantidade"] }
                    ]
                });

                const totaisPorPagamento = {
                    dinheiro: 0,
                    cartao: 0,
                    pix: 0,
                };

                pedidos.forEach(p => {
                    if (p.formaPagamento === "dinheiro") totaisPorPagamento.dinheiro += p.total;
                    else if (p.formaPagamento === "cartao") totaisPorPagamento.cartao += p.total;
                    else if (p.formaPagamento === "pix") totaisPorPagamento.pix += p.total;
                });

                return {
                    caixaId: caixa.id,
                    status: caixa.status,
                    dataAbertura: caixa.dataAbertura,
                    dataFechamento: caixa.dataFechamento,
                    totalVendido: caixa.totalVendido || 0,
                    totaisPorPagamento,
                    pedido: pedidos.map(p => ({
                        id: p.id,
                        cliente: p.Cliente?.nome,
                        total: p.total,
                        formaPagamento: p.formaPagamento,
                        data: p.data,
                        itens: p.itens?.map(i => ({
                            descricao: i.descricao,
                            quantidade: i.quantidade
                        })) || []
                    }))
                };
            })
        );

        return res.json(resultado);

        console.log(resultado)
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Erro ao buscar histórico do caixa", error });
    }
};
