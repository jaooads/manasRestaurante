// src/database/index.ts
import { sequelize } from "./database.js";
import "../models/cliente.js";
import "../models/produto.js";
import "../models/pedido.js";
import "../models/itemPedido.js";
import "../models/caixa.js";
import "../models/relatorio.js";

export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("Conectado ao banco SQLite com sucesso!");
        await sequelize.sync({ alter: true });
        console.log("Tabelas sincronizadas!");
    } catch (error) {
        console.error("Erro ao conectar no banco:", error);
    }
};
