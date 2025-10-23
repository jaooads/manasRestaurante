import { Request, Response } from "express";
import { Produto } from "../models/produto.js";

export const criarProduto = async (req: Request, res: Response) => {
    try {
        const { nome, preco } = req.body;

        if (!nome || preco == null) return res.status(400).json({ msg: "Nome e preço obrigatórios" });

        const produto = await Produto.create({ nome, preco });

        return res.status(201).json({ msg: "Produto criado", produto });

    } catch (error) {
        console.error("Erro ao criar produto:", error);
        return res.status(500).json({ msg: "Erro ao criar produto" });
    }
};

export const listarProdutos = async (_req: Request, res: Response) => {
    try {
        const produtos = await Produto.findAll();
        return res.json(produtos);
    } catch (error) {
        console.error("Erro ao listar produtos:", error);
        return res.status(500).json({ msg: "Erro ao listar produtos" });
    }
};
