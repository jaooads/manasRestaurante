import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
    process.env.DB_NAME as string,
    process.env.DB_USER as string,
    process.env.DB_PASS as string,
    {
        host: process.env.DB_HOST,
        dialect: "mysql",
        logging: false,
    }
);

export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("Conectado ao banco com sucesso!");

        // cria todas as tabelas definidas nos models
        await sequelize.sync({ alter: true }); 
        console.log("Tabelas sincronizadas!");
    } catch (error) {
        console.error("Erro ao conectar no banco:", error);
    }
};